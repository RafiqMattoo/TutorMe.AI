using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Application.Deliveries
{
    // Shared in-memory projection. Kept out of the EF query (enum .ToString())
    // by materialising first — delivery lists are small (one school/day).
    internal static class DeliveryMapper
    {
        public static DeliveryDto ToDto(Delivery d) => new(
            d.Id, d.Title, d.Instructions, d.ScheduledDate, d.GradeLevel,
            d.MaterialId, d.Material?.Title, d.Material?.Status.ToString(), d.Material?.FileUrl,
            d.QuizId, d.Quiz?.Title, d.Quiz?.QuestionCount,
            d.FlashcardSetId, d.FlashcardSet?.Title, d.FlashcardSet?.CardCount,
            d.CreatedBy != null ? $"{d.CreatedBy.FirstName} {d.CreatedBy.LastName}" : string.Empty,
            d.CreatedAt);

        public static IQueryable<Delivery> WithContent(this IQueryable<Delivery> q) => q
            .Include(d => d.CreatedBy)
            .Include(d => d.Material)
            .Include(d => d.Quiz)
            .Include(d => d.FlashcardSet);
    }
}

namespace VidyaAI.Application.Deliveries.Queries
{
    using VidyaAI.Application.Deliveries;

    // Teacher / admin management view: a school's deliveries, optionally one day.
    public record GetDeliveriesQuery(Guid? SchoolId, DateOnly? Date)
        : IRequest<IReadOnlyList<DeliveryDto>>;

    public sealed class GetDeliveriesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetDeliveriesQuery, IReadOnlyList<DeliveryDto>>
    {
        public async Task<IReadOnlyList<DeliveryDto>> Handle(GetDeliveriesQuery q, CancellationToken ct)
        {
            var query = db.Deliveries.AsNoTracking().WithContent();
            if (q.SchoolId.HasValue) query = query.Where(d => d.SchoolId == q.SchoolId);
            if (q.Date.HasValue) query = query.Where(d => d.ScheduledDate == q.Date.Value);

            var rows = await query
                .OrderByDescending(d => d.ScheduledDate).ThenByDescending(d => d.CreatedAt)
                .ToListAsync(ct);
            return rows.Select(DeliveryMapper.ToDto).ToList();
        }
    }

    // Student view: what was delivered to my school on this day.
    public record GetTodayDeliveriesQuery(Guid? SchoolId, DateOnly Date)
        : IRequest<IReadOnlyList<DeliveryDto>>;

    public sealed class GetTodayDeliveriesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetTodayDeliveriesQuery, IReadOnlyList<DeliveryDto>>
    {
        public async Task<IReadOnlyList<DeliveryDto>> Handle(GetTodayDeliveriesQuery q, CancellationToken ct)
        {
            var query = db.Deliveries.AsNoTracking().WithContent()
                .Where(d => d.ScheduledDate == q.Date);
            if (q.SchoolId.HasValue) query = query.Where(d => d.SchoolId == q.SchoolId);

            var rows = await query.OrderByDescending(d => d.CreatedAt).ToListAsync(ct);
            return rows.Select(DeliveryMapper.ToDto).ToList();
        }
    }
}

namespace VidyaAI.Application.Deliveries.Commands
{
    using VidyaAI.Application.Deliveries;

    public record CreateDeliveryCommand(
        string Title, string? Instructions, DateOnly ScheduledDate, string? GradeLevel,
        Guid? MaterialId, Guid? QuizId, Guid? FlashcardSetId,
        Guid CreatedById, Guid? SchoolId) : IRequest<DeliveryDto>;

    public sealed class CreateDeliveryCommandHandler(IAppDbContext db)
        : IRequestHandler<CreateDeliveryCommand, DeliveryDto>
    {
        public async Task<DeliveryDto> Handle(CreateDeliveryCommand cmd, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(cmd.Title))
                throw new ArgumentException("Title is required.");
            if (cmd.MaterialId is null && cmd.QuizId is null && cmd.FlashcardSetId is null)
                throw new ArgumentException("Attach at least one of: material, quiz, or flashcards.");

            if (cmd.MaterialId is Guid mid && !await db.Materials.AnyAsync(m => m.Id == mid, ct))
                throw new KeyNotFoundException("Material not found.");
            if (cmd.QuizId is Guid qid && !await db.Quizzes.AnyAsync(x => x.Id == qid, ct))
                throw new KeyNotFoundException("Quiz not found.");
            if (cmd.FlashcardSetId is Guid fid && !await db.FlashcardSets.AnyAsync(x => x.Id == fid, ct))
                throw new KeyNotFoundException("Flashcard set not found.");

            var delivery = new Delivery
            {
                Title = cmd.Title.Trim(),
                Instructions = string.IsNullOrWhiteSpace(cmd.Instructions) ? null : cmd.Instructions.Trim(),
                ScheduledDate = cmd.ScheduledDate,
                GradeLevel = string.IsNullOrWhiteSpace(cmd.GradeLevel) ? null : cmd.GradeLevel.Trim(),
                MaterialId = cmd.MaterialId,
                QuizId = cmd.QuizId,
                FlashcardSetId = cmd.FlashcardSetId,
                CreatedById = cmd.CreatedById,
                SchoolId = cmd.SchoolId
            };
            db.Deliveries.Add(delivery);
            await db.SaveChangesAsync(ct);

            var saved = await db.Deliveries.AsNoTracking().WithContent()
                .FirstAsync(d => d.Id == delivery.Id, ct);
            return DeliveryMapper.ToDto(saved);
        }
    }

    public record DeleteDeliveryCommand(Guid Id) : IRequest;

    public sealed class DeleteDeliveryCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteDeliveryCommand>
    {
        public async Task Handle(DeleteDeliveryCommand cmd, CancellationToken ct)
        {
            var d = await db.Deliveries.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException("Delivery not found.");
            d.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
