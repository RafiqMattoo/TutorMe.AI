using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Application.LessonPlans.Queries
{
    public record GetLessonPlansQuery(Guid? SchoolId, Guid? MaterialId)
        : IRequest<IReadOnlyList<LessonPlanSummaryDto>>;

    public sealed class GetLessonPlansQueryHandler(IAppDbContext db)
        : IRequestHandler<GetLessonPlansQuery, IReadOnlyList<LessonPlanSummaryDto>>
    {
        public async Task<IReadOnlyList<LessonPlanSummaryDto>> Handle(GetLessonPlansQuery q, CancellationToken ct)
        {
            var query = db.LessonPlans.AsNoTracking()
                .Include(p => p.CreatedBy).Include(p => p.Material).AsQueryable();
            if (q.SchoolId.HasValue) query = query.Where(p => p.SchoolId == q.SchoolId);
            if (q.MaterialId.HasValue) query = query.Where(p => p.MaterialId == q.MaterialId);

            return await query.OrderByDescending(p => p.CreatedAt)
                .Select(p => new LessonPlanSummaryDto(
                    p.Id, p.Title, p.Subject, p.GradeLevel, p.DurationMinutes,
                    p.MaterialId, p.Material != null ? p.Material.Title : null,
                    p.CreatedBy.FirstName + " " + p.CreatedBy.LastName, p.CreatedAt))
                .ToListAsync(ct);
        }
    }

    public record GetLessonPlanByIdQuery(Guid Id) : IRequest<LessonPlanDto>;

    public sealed class GetLessonPlanByIdQueryHandler(IAppDbContext db)
        : IRequestHandler<GetLessonPlanByIdQuery, LessonPlanDto>
    {
        public async Task<LessonPlanDto> Handle(GetLessonPlanByIdQuery q, CancellationToken ct)
        {
            var p = await db.LessonPlans.AsNoTracking()
                .Include(x => x.CreatedBy).Include(x => x.Material)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException("Lesson plan not found.");

            return new LessonPlanDto(p.Id, p.Title, p.Subject, p.GradeLevel,
                p.DurationMinutes, p.ContentMarkdown,
                p.MaterialId, p.Material?.Title,
                p.CreatedBy.FirstName + " " + p.CreatedBy.LastName, p.CreatedAt);
        }
    }
}

namespace VidyaAI.Application.LessonPlans.Commands
{
    public record GenerateLessonPlanCommand(
        Guid MaterialId, string? Title, string? Subject, string? GradeLevel,
        int DurationMinutes, Guid CreatedById, Guid? SchoolId)
        : IRequest<LessonPlanDto>;

    public sealed class GenerateLessonPlanCommandHandler(
        IAppDbContext db, ILlmChatService llm, ILogger<GenerateLessonPlanCommandHandler> log)
        : IRequestHandler<GenerateLessonPlanCommand, LessonPlanDto>
    {
        private const int MaxContextChars = 12000;

        public async Task<LessonPlanDto> Handle(GenerateLessonPlanCommand cmd, CancellationToken ct)
        {
            var material = await db.Materials.AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == cmd.MaterialId, ct)
                ?? throw new KeyNotFoundException("Material not found.");

            var chunks = await db.MaterialChunks.AsNoTracking()
                .Where(c => c.MaterialId == cmd.MaterialId)
                .OrderBy(c => c.ChunkIndex).Select(c => c.Content).ToListAsync(ct);
            if (chunks.Count == 0) throw new InvalidOperationException("Material has not been indexed yet.");

            var contextBlock = TrimToBudget(chunks, MaxContextChars);
            var duration = Math.Clamp(cmd.DurationMinutes <= 0 ? 60 : cmd.DurationMinutes, 15, 240);

            var systemPrompt = """
                You are an expert curriculum designer. Produce a single, well-structured lesson plan
                in clean Markdown. Use these section headings (in this order):
                ## Learning Objectives
                ## Prerequisites
                ## Materials & Resources
                ## Lesson Outline (with timed segments)
                ## Activities
                ## Assessment
                ## Homework / Extension
                Be concrete and ground every section in the source material provided.
                Output ONLY the markdown — no preamble, no code fences.
                """;

            var subjectLine = string.IsNullOrWhiteSpace(cmd.Subject) ? "Subject: (infer from material)" : $"Subject: {cmd.Subject}";
            var gradeLine = string.IsNullOrWhiteSpace(cmd.GradeLevel) ? "Grade level: (infer from material)" : $"Grade level: {cmd.GradeLevel}";

            var userPrompt = $"""
                Generate a {duration}-minute lesson plan grounded in the material below.
                {subjectLine}
                {gradeLine}

                MATERIAL:
                {contextBlock}
                """;

            string markdown;
            try
            {
                markdown = await llm.CompleteAsync(systemPrompt,
                    new List<ChatTurn> { new("user", userPrompt) }, ct);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Lesson plan generation failed");
                throw new InvalidOperationException("AI service is rate-limited — try again in a minute.", ex);
            }

            if (string.IsNullOrWhiteSpace(markdown))
                throw new InvalidOperationException("Model returned an empty lesson plan.");

            var plan = new LessonPlan
            {
                Title = string.IsNullOrWhiteSpace(cmd.Title) ? $"{material.Title} — Lesson Plan" : cmd.Title,
                Subject = cmd.Subject,
                GradeLevel = cmd.GradeLevel,
                DurationMinutes = duration,
                ContentMarkdown = markdown.Trim(),
                MaterialId = material.Id,
                CreatedById = cmd.CreatedById,
                SchoolId = cmd.SchoolId
            };
            db.LessonPlans.Add(plan);
            await db.SaveChangesAsync(ct);

            return await new VidyaAI.Application.LessonPlans.Queries.GetLessonPlanByIdQueryHandler(db)
                .Handle(new VidyaAI.Application.LessonPlans.Queries.GetLessonPlanByIdQuery(plan.Id), ct);
        }

        private static string TrimToBudget(IEnumerable<string> chunks, int maxChars)
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

    public record DeleteLessonPlanCommand(Guid Id) : IRequest;

    public sealed class DeleteLessonPlanCommandHandler(IAppDbContext db) : IRequestHandler<DeleteLessonPlanCommand>
    {
        public async Task Handle(DeleteLessonPlanCommand cmd, CancellationToken ct)
        {
            var p = await db.LessonPlans.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Lesson plan not found.");
            p.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
