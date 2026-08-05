using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Application.Flashcards.Queries
{
    public record GetFlashcardSetsQuery(Guid? SchoolId, Guid? MaterialId)
        : IRequest<IReadOnlyList<FlashcardSetSummaryDto>>;

    public sealed class GetFlashcardSetsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetFlashcardSetsQuery, IReadOnlyList<FlashcardSetSummaryDto>>
    {
        public async Task<IReadOnlyList<FlashcardSetSummaryDto>> Handle(GetFlashcardSetsQuery q, CancellationToken ct)
        {
            var query = db.FlashcardSets.AsNoTracking()
                .Include(s => s.CreatedBy).Include(s => s.Material)
                .AsQueryable();
            if (q.SchoolId.HasValue) query = query.Where(s => s.SchoolId == q.SchoolId);
            if (q.MaterialId.HasValue) query = query.Where(s => s.MaterialId == q.MaterialId);

            return await query.OrderByDescending(s => s.CreatedAt)
                .Select(s => new FlashcardSetSummaryDto(
                    s.Id, s.Title, s.Description, s.CardCount,
                    s.MaterialId, s.Material != null ? s.Material.Title : null,
                    s.CreatedBy.FirstName + " " + s.CreatedBy.LastName, s.CreatedAt))
                .ToListAsync(ct);
        }
    }

    public record GetFlashcardSetByIdQuery(Guid Id) : IRequest<FlashcardSetDto>;

    public sealed class GetFlashcardSetByIdQueryHandler(IAppDbContext db)
        : IRequestHandler<GetFlashcardSetByIdQuery, FlashcardSetDto>
    {
        public async Task<FlashcardSetDto> Handle(GetFlashcardSetByIdQuery q, CancellationToken ct)
        {
            var s = await db.FlashcardSets.AsNoTracking()
                .Include(x => x.CreatedBy).Include(x => x.Material)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException("Flashcard set not found.");

            var cards = await db.Flashcards.AsNoTracking()
                .Where(c => c.SetId == q.Id).OrderBy(c => c.OrderIndex)
                .Select(c => new FlashcardDto(c.Id, c.OrderIndex, c.Front, c.Back))
                .ToListAsync(ct);

            return new FlashcardSetDto(s.Id, s.Title, s.Description, s.CardCount,
                s.MaterialId, s.Material?.Title,
                s.CreatedBy.FirstName + " " + s.CreatedBy.LastName, s.CreatedAt, cards);
        }
    }
}

namespace VidyaAI.Application.Flashcards.Commands
{
    public record GenerateFlashcardsCommand(
        Guid MaterialId, string? Title, int Count, Guid CreatedById, Guid? SchoolId)
        : IRequest<FlashcardSetDto>;

    public sealed class GenerateFlashcardsCommandHandler(
        IAppDbContext db, ILlmChatService llm, ILogger<GenerateFlashcardsCommandHandler> log)
        : IRequestHandler<GenerateFlashcardsCommand, FlashcardSetDto>
    {
        private const int MaxCount = 30;
        private const int MaxContextChars = 14000;

        public async Task<FlashcardSetDto> Handle(GenerateFlashcardsCommand cmd, CancellationToken ct)
        {
            var material = await db.Materials.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == cmd.MaterialId, ct)
                ?? throw new KeyNotFoundException("Material not found.");

            var count = Math.Clamp(cmd.Count <= 0 ? 10 : cmd.Count, 3, MaxCount);

            var chunks = await db.MaterialChunks.AsNoTracking()
                .Where(c => c.MaterialId == cmd.MaterialId)
                .OrderBy(c => c.ChunkIndex)
                .Select(c => c.Content)
                .ToListAsync(ct);

            if (chunks.Count == 0)
                throw new InvalidOperationException("Material has not been indexed yet.");

            var contextBlock = TrimToBudget(chunks, MaxContextChars);

            var systemPrompt = """
                You are an expert study-aid generator. Produce high-quality flashcards
                that cover the most important facts and concepts in the material. Avoid duplicates.
                Each card has a clear, focused question on the front and a DETAILED, thorough
                answer on the back. The back should fully explain the concept — include the
                definition, the key facts, the reasoning or mechanism behind it, and a concrete
                example or context where helpful — so the learner can understand it from the
                card alone. Write the back as 3-6 complete sentences (or a short structured
                explanation), not a single terse phrase.
                Return a JSON OBJECT of the form {"cards": [ ... ]} — no markdown, no commentary.
                """;

            var userPrompt = $$"""
                Generate exactly {{count}} DISTINCT flashcards from the material below.

                Return a JSON object in EXACTLY this shape, with all {{count}} cards in the array:
                {"cards": [{"front": "question or term", "back": "the detailed answer"}, {"front": "...", "back": "..."}]}

                Requirements for each card:
                - The "front" is a clear, focused question or term.
                - The "back" is a DETAILED, self-contained explanation (3-6 complete sentences):
                  define the concept, give the key facts, explain the reasoning or mechanism,
                  and add a concrete example or context when it aids understanding.
                - Do NOT give one-word or one-line answers — be thorough but accurate.

                Do NOT return a single card object — always return the "cards" array containing
                every card. Base the cards only on the material.

                MATERIAL:
                {{contextBlock}}
                """;

            var raw = await llm.CompleteJsonAsync(systemPrompt, userPrompt, ct);
            var cards = ParseCards(raw, log);
            if (cards.Count == 0)
                throw new InvalidOperationException("Model did not return any flashcards.");

            var set = new FlashcardSet
            {
                Title = string.IsNullOrWhiteSpace(cmd.Title) ? $"{material.Title} — Flashcards" : cmd.Title,
                Description = $"Generated from {material.Title}",
                CardCount = cards.Count,
                MaterialId = material.Id,
                CreatedById = cmd.CreatedById,
                SchoolId = cmd.SchoolId
            };
            db.FlashcardSets.Add(set);

            for (var i = 0; i < cards.Count; i++)
            {
                db.Flashcards.Add(new Flashcard
                {
                    Set = set,
                    OrderIndex = i,
                    Front = cards[i].Front,
                    Back = cards[i].Back
                });
            }
            await db.SaveChangesAsync(ct);

            return await new VidyaAI.Application.Flashcards.Queries.GetFlashcardSetByIdQueryHandler(db)
                .Handle(new VidyaAI.Application.Flashcards.Queries.GetFlashcardSetByIdQuery(set.Id), ct);
        }

        private static List<RawCard> ParseCards(string json, ILogger log)
        {
            try
            {
                using var doc = JsonDocument.Parse(json);
                var list = new List<RawCard>();
                foreach (var el in JsonItems.Extract(doc.RootElement))
                {
                    // Accept the requested keys plus the alternates small models tend to use.
                    var front = Str(el, "front") ?? Str(el, "question") ?? Str(el, "term") ?? Str(el, "q");
                    var back = Str(el, "back") ?? Str(el, "answer") ?? Str(el, "definition") ?? Str(el, "a");
                    if (!string.IsNullOrWhiteSpace(front) && !string.IsNullOrWhiteSpace(back))
                        list.Add(new RawCard(front!.Trim(), back!.Trim()));
                }
                return list;
            }
            catch (Exception ex)
            {
                log.LogWarning(ex, "Could not parse flashcard JSON: {Sample}",
                    json.Length > 200 ? json[..200] : json);
                return [];
            }
        }

        private static string? Str(JsonElement el, string name) =>
            el.ValueKind == JsonValueKind.Object && el.TryGetProperty(name, out var v) ? v.GetString() : null;

        private static string TrimToBudget(List<string> chunks, int maxChars)
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

        private sealed record RawCard(string Front, string Back);
    }

    public record DeleteFlashcardSetCommand(Guid Id) : IRequest;

    public sealed class DeleteFlashcardSetCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteFlashcardSetCommand>
    {
        public async Task Handle(DeleteFlashcardSetCommand cmd, CancellationToken ct)
        {
            var s = await db.FlashcardSets.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Flashcard set not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
