using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Quizzes.Queries
{
    public record GetQuizzesQuery(Guid? SchoolId, Guid? MaterialId)
        : IRequest<IReadOnlyList<QuizSummaryDto>>;

    public sealed class GetQuizzesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetQuizzesQuery, IReadOnlyList<QuizSummaryDto>>
    {
        public async Task<IReadOnlyList<QuizSummaryDto>> Handle(GetQuizzesQuery q, CancellationToken ct)
        {
            var query = db.Quizzes.AsNoTracking()
                .Include(x => x.CreatedBy).Include(x => x.Material)
                .AsQueryable();
            if (q.SchoolId.HasValue) query = query.Where(x => x.SchoolId == q.SchoolId);
            if (q.MaterialId.HasValue) query = query.Where(x => x.MaterialId == q.MaterialId);

            return await query.OrderByDescending(x => x.CreatedAt)
                .Select(x => new QuizSummaryDto(
                    x.Id, x.Title, x.QuestionCount, x.Difficulty,
                    x.MaterialId, x.Material != null ? x.Material.Title : null,
                    x.Attempts.Count,
                    x.CreatedBy.FirstName + " " + x.CreatedBy.LastName, x.CreatedAt))
                .ToListAsync(ct);
        }
    }

    // Returns the quiz WITHOUT the correct answers — used when a student is about to take the quiz.
    public record GetQuizForTakingQuery(Guid Id) : IRequest<QuizDto>;

    public sealed class GetQuizForTakingQueryHandler(IAppDbContext db)
        : IRequestHandler<GetQuizForTakingQuery, QuizDto>
    {
        public async Task<QuizDto> Handle(GetQuizForTakingQuery q, CancellationToken ct)
        {
            var quiz = await db.Quizzes.AsNoTracking()
                .Include(x => x.CreatedBy).Include(x => x.Material)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException("Quiz not found.");

            var qs = await db.QuizQuestions.AsNoTracking()
                .Where(x => x.QuizId == q.Id).OrderBy(x => x.OrderIndex)
                .Select(x => new
                {
                    x.Id, x.OrderIndex, x.QuestionText, x.OptionsJson
                })
                .ToListAsync(ct);

            var questions = qs.Select(x => new QuizQuestionDto(
                x.Id, x.OrderIndex, x.QuestionText,
                JsonHelpers.ParseStringArray(x.OptionsJson), null, null)).ToList();

            return new QuizDto(quiz.Id, quiz.Title, quiz.Description, quiz.QuestionCount,
                quiz.Difficulty, quiz.MaterialId, quiz.Material?.Title,
                quiz.CreatedBy.FirstName + " " + quiz.CreatedBy.LastName, quiz.CreatedAt, questions);
        }
    }
}

namespace VidyaAI.Application.Quizzes.Commands
{
    public record GenerateQuizCommand(
        Guid MaterialId, string? Title, int Count, QuizDifficulty Difficulty,
        Guid CreatedById, Guid? SchoolId) : IRequest<QuizSummaryDto>;

    public sealed class GenerateQuizCommandHandler(
        IAppDbContext db, ILlmChatService llm, ILogger<GenerateQuizCommandHandler> log)
        : IRequestHandler<GenerateQuizCommand, QuizSummaryDto>
    {
        private const int MaxCount = 25;
        private const int MaxContextChars = 14000;

        public async Task<QuizSummaryDto> Handle(GenerateQuizCommand cmd, CancellationToken ct)
        {
            var material = await db.Materials.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == cmd.MaterialId, ct)
                ?? throw new KeyNotFoundException("Material not found.");

            var count = Math.Clamp(cmd.Count <= 0 ? 10 : cmd.Count, 3, MaxCount);

            var chunks = await db.MaterialChunks.AsNoTracking()
                .Where(c => c.MaterialId == cmd.MaterialId)
                .OrderBy(c => c.ChunkIndex).Select(c => c.Content).ToListAsync(ct);
            if (chunks.Count == 0) throw new InvalidOperationException("Material has not been indexed yet.");

            var contextBlock = JsonHelpers.TrimToBudget(chunks, MaxContextChars);

            var difficultyHint = cmd.Difficulty switch
            {
                QuizDifficulty.Easy => "Recall and identification questions.",
                QuizDifficulty.Hard => "Application, analysis, and tricky distractors.",
                _ => "A balanced mix of recall and conceptual understanding."
            };

            var systemPrompt = $$"""
                You are an expert quiz generator. Produce high-quality multiple-choice questions
                grounded in the material. Each question has exactly 4 plausible options.
                Difficulty: {{cmd.Difficulty}}. {{difficultyHint}}
                Return ONLY a JSON array — no markdown, no commentary.
                """;

            var userPrompt = $$"""
                Generate exactly {{count}} multiple-choice questions from the material below.
                Schema: [{"question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "..."}]
                correctIndex must be 0-3. Provide a brief explanation for each.

                MATERIAL:
                {{contextBlock}}
                """;

            var raw = await llm.CompleteJsonAsync(systemPrompt, userPrompt, ct);
            var parsed = ParseQuestions(raw, log);
            if (parsed.Count == 0) throw new InvalidOperationException("Model did not return any questions.");

            var quiz = new Quiz
            {
                Title = string.IsNullOrWhiteSpace(cmd.Title) ? $"{material.Title} — Quiz" : cmd.Title,
                Description = $"Generated from {material.Title}",
                QuestionCount = parsed.Count,
                Difficulty = cmd.Difficulty,
                MaterialId = material.Id,
                CreatedById = cmd.CreatedById,
                SchoolId = cmd.SchoolId
            };
            db.Quizzes.Add(quiz);

            for (var i = 0; i < parsed.Count; i++)
            {
                var p = parsed[i];
                db.QuizQuestions.Add(new QuizQuestion
                {
                    Quiz = quiz,
                    OrderIndex = i,
                    QuestionText = p.Question,
                    OptionsJson = JsonSerializer.Serialize(p.Options),
                    CorrectIndex = Math.Clamp(p.CorrectIndex, 0, p.Options.Length - 1),
                    Explanation = p.Explanation
                });
            }
            await db.SaveChangesAsync(ct);

            return new QuizSummaryDto(quiz.Id, quiz.Title, quiz.QuestionCount, quiz.Difficulty,
                quiz.MaterialId, material.Title, 0, "you", quiz.CreatedAt);
        }

        private static List<RawQ> ParseQuestions(string json, ILogger log)
        {
            try
            {
                using var doc = JsonDocument.Parse(json);
                var root = UnwrapArray(doc.RootElement);
                if (root.ValueKind != JsonValueKind.Array) return [];

                var list = new List<RawQ>();
                foreach (var el in root.EnumerateArray())
                {
                    var question = el.TryGetProperty("question", out var q) ? q.GetString() : null;
                    var options = el.TryGetProperty("options", out var o) && o.ValueKind == JsonValueKind.Array
                        ? o.EnumerateArray().Select(x => x.GetString() ?? string.Empty).ToArray()
                        : Array.Empty<string>();
                    var correct = el.TryGetProperty("correctIndex", out var ci) && ci.TryGetInt32(out var ciVal) ? ciVal : 0;
                    var explanation = el.TryGetProperty("explanation", out var ex) ? ex.GetString() : null;

                    if (!string.IsNullOrWhiteSpace(question) && options.Length >= 2)
                        list.Add(new RawQ(question!.Trim(), options, correct, explanation?.Trim()));
                }
                return list;
            }
            catch (Exception ex)
            {
                log.LogWarning(ex, "Could not parse quiz JSON: {Sample}",
                    json.Length > 200 ? json[..200] : json);
                return [];
            }
        }

        // Models in JSON mode often wrap the array in an object, e.g.
        // {"questions": [...]}, {"quiz": [...]}. Gemini returns a bare array;
        // local models (gemma/llama) vary the wrapper key. Unwrap to the first
        // array-valued property regardless of its name.
        private static JsonElement UnwrapArray(JsonElement root)
        {
            if (root.ValueKind == JsonValueKind.Array) return root;
            if (root.ValueKind == JsonValueKind.Object)
                foreach (var prop in root.EnumerateObject())
                    if (prop.Value.ValueKind == JsonValueKind.Array)
                        return prop.Value;
            return root;
        }

        private sealed record RawQ(string Question, string[] Options, int CorrectIndex, string? Explanation);
    }

    public record SubmitQuizAttemptCommand(Guid QuizId, Guid UserId, IReadOnlyDictionary<Guid, int> Answers)
        : IRequest<QuizAttemptResultDto>;

    public sealed class SubmitQuizAttemptCommandHandler(IAppDbContext db)
        : IRequestHandler<SubmitQuizAttemptCommand, QuizAttemptResultDto>
    {
        public async Task<QuizAttemptResultDto> Handle(SubmitQuizAttemptCommand cmd, CancellationToken ct)
        {
            var quiz = await db.Quizzes.AsNoTracking()
                .FirstOrDefaultAsync(q => q.Id == cmd.QuizId, ct)
                ?? throw new KeyNotFoundException("Quiz not found.");

            var questions = await db.QuizQuestions.AsNoTracking()
                .Where(q => q.QuizId == cmd.QuizId).OrderBy(q => q.OrderIndex).ToListAsync(ct);

            var results = new List<QuizQuestionResultDto>();
            var correct = 0;
            foreach (var q in questions)
            {
                cmd.Answers.TryGetValue(q.Id, out var selected);
                var hasAnswer = cmd.Answers.ContainsKey(q.Id);
                var isCorrect = hasAnswer && selected == q.CorrectIndex;
                if (isCorrect) correct++;

                results.Add(new QuizQuestionResultDto(
                    q.Id, q.QuestionText, JsonHelpers.ParseStringArray(q.OptionsJson),
                    q.CorrectIndex, hasAnswer ? selected : null, isCorrect, q.Explanation));
            }

            var attempt = new QuizAttempt
            {
                QuizId = quiz.Id,
                UserId = cmd.UserId,
                Score = correct,
                TotalQuestions = questions.Count,
                CompletedAt = DateTime.UtcNow,
                AnswersJson = JsonSerializer.Serialize(cmd.Answers
                    .ToDictionary(k => k.Key.ToString(), v => v.Value))
            };
            db.QuizAttempts.Add(attempt);
            await db.SaveChangesAsync(ct);

            return new QuizAttemptResultDto(attempt.Id, quiz.Id, correct, questions.Count,
                attempt.CompletedAt, results);
        }
    }

    public record DeleteQuizCommand(Guid Id) : IRequest;

    public sealed class DeleteQuizCommandHandler(IAppDbContext db) : IRequestHandler<DeleteQuizCommand>
    {
        public async Task Handle(DeleteQuizCommand cmd, CancellationToken ct)
        {
            var quiz = await db.Quizzes.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Quiz not found.");
            quiz.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}

namespace VidyaAI.Application.Quizzes
{
    internal static class JsonHelpers
    {
        public static List<string> ParseStringArray(string json)
        {
            try
            {
                var list = JsonSerializer.Deserialize<List<string>>(json);
                return list ?? [];
            }
            catch { return []; }
        }

        public static string TrimToBudget(IEnumerable<string> chunks, int maxChars)
        {
            var sb = new System.Text.StringBuilder();
            foreach (var c in chunks)
            {
                if (sb.Length + c.Length + 2 > maxChars) break;
                sb.AppendLine(c);
                sb.AppendLine();
            }
            return sb.ToString();
        }
    }
}
