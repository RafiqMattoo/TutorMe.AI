using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Notifications
{
    // Shared helper so registration/approval handlers can drop in-app notifications
    // without each re-implementing the row creation. Rows are added (not saved) —
    // the caller owns the SaveChanges.
    public static class NotificationFactory
    {
        public static void Add(IAppDbContext db, Guid userId, NotificationType type,
            string title, string message, string? referenceId = null)
        {
            db.Notifications.Add(new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Message = message,
                ReferenceId = referenceId,
                IsRead = false,
            });
        }

        // Notifies every active user in a role (optionally scoped to a school).
        public static async Task AddForRoleAsync(IAppDbContext db, UserRole role, Guid? schoolId,
            NotificationType type, string title, string message, string? referenceId, CancellationToken ct)
        {
            var recipients = await db.Users.AsNoTracking()
                .Where(u => u.Role == role && u.IsActive && !u.IsDeleted
                    && (schoolId == null || u.SchoolId == schoolId))
                .Select(u => u.Id)
                .ToListAsync(ct);
            foreach (var id in recipients)
                Add(db, id, type, title, message, referenceId);
        }
    }
}

namespace VidyaAI.Application.Notifications.Queries
{
    public record GetNotificationsQuery(Guid UserId) : IRequest<IReadOnlyList<NotificationDto>>;

    public sealed class GetNotificationsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetNotificationsQuery, IReadOnlyList<NotificationDto>>
    {
        public async Task<IReadOnlyList<NotificationDto>> Handle(GetNotificationsQuery q, CancellationToken ct) =>
            await db.Notifications.AsNoTracking()
                .Where(n => n.UserId == q.UserId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .Select(n => new NotificationDto(n.Id, n.Type, n.Title, n.Message, n.IsRead, n.ReferenceId, n.CreatedAt))
                .ToListAsync(ct);
    }
}

namespace VidyaAI.Application.Notifications.Commands
{
    public record MarkNotificationReadCommand(Guid Id, Guid UserId) : IRequest;

    public sealed class MarkNotificationReadCommandHandler(IAppDbContext db)
        : IRequestHandler<MarkNotificationReadCommand>
    {
        public async Task Handle(MarkNotificationReadCommand cmd, CancellationToken ct)
        {
            var n = await db.Notifications.FirstOrDefaultAsync(x => x.Id == cmd.Id && x.UserId == cmd.UserId, ct);
            if (n is null || n.IsRead) return;
            n.IsRead = true;
            await db.SaveChangesAsync(ct);
        }
    }

    public record MarkAllNotificationsReadCommand(Guid UserId) : IRequest;

    public sealed class MarkAllNotificationsReadCommandHandler(IAppDbContext db)
        : IRequestHandler<MarkAllNotificationsReadCommand>
    {
        public async Task Handle(MarkAllNotificationsReadCommand cmd, CancellationToken ct)
        {
            var unread = await db.Notifications.Where(n => n.UserId == cmd.UserId && !n.IsRead).ToListAsync(ct);
            foreach (var n in unread) n.IsRead = true;
            if (unread.Count > 0) await db.SaveChangesAsync(ct);
        }
    }
}
