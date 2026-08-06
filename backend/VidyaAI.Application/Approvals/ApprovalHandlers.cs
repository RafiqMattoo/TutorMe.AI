using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Notifications;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Approvals.Queries
{
    // Pending schools awaiting SuperAdmin review, joined to their (pending) admin.
    public record GetPendingSchoolsQuery : IRequest<IReadOnlyList<PendingSchoolDto>>;

    public sealed class GetPendingSchoolsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPendingSchoolsQuery, IReadOnlyList<PendingSchoolDto>>
    {
        public async Task<IReadOnlyList<PendingSchoolDto>> Handle(GetPendingSchoolsQuery q, CancellationToken ct)
        {
            var schools = await db.Schools.AsNoTracking()
                .Where(s => s.ApprovalStatus == ApprovalStatus.Pending)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync(ct);

            var ids = schools.Select(s => s.Id).ToList();
            var admins = await db.Users.AsNoTracking()
                .Where(u => u.Role == UserRole.SchoolAdmin && u.SchoolId != null && ids.Contains(u.SchoolId!.Value))
                .Select(u => new { u.SchoolId, u.FirstName, u.LastName, u.Email })
                .ToListAsync(ct);

            return schools.Select(s =>
            {
                var a = admins.FirstOrDefault(x => x.SchoolId == s.Id);
                return new PendingSchoolDto(s.Id, s.Name, s.City, s.State, s.Type, s.Board,
                    a is null ? null : $"{a.FirstName} {a.LastName}", a?.Email, s.DocumentUrl, s.CreatedAt);
            }).ToList();
        }
    }

    // Pending teachers/students. SuperAdmin sees all; a SchoolAdmin sees only theirs.
    public record GetPendingMembersQuery(bool ActorIsSuperAdmin, Guid? ActorSchoolId)
        : IRequest<IReadOnlyList<PendingMemberDto>>;

    public sealed class GetPendingMembersQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPendingMembersQuery, IReadOnlyList<PendingMemberDto>>
    {
        public async Task<IReadOnlyList<PendingMemberDto>> Handle(GetPendingMembersQuery q, CancellationToken ct)
        {
            var query = db.Users.AsNoTracking().Include(u => u.School)
                .Where(u => u.ApprovalStatus == ApprovalStatus.Pending
                    && (u.Role == UserRole.Teacher || u.Role == UserRole.Student));
            if (!q.ActorIsSuperAdmin)
                query = query.Where(u => u.SchoolId == q.ActorSchoolId);

            return await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new PendingMemberDto(u.Id, u.FirstName, u.LastName, u.Email, u.Role,
                    u.SchoolId, u.School != null ? u.School.Name : null, u.GradeLevel, u.RollNumber, u.CreatedAt))
                .ToListAsync(ct);
        }
    }
}

namespace VidyaAI.Application.Approvals.Commands
{
    // ── SCHOOLS (SuperAdmin) ──────────────────────────────────────
    public record DecideSchoolCommand(Guid SchoolId, bool Approve) : IRequest;

    public sealed class DecideSchoolCommandHandler(IAppDbContext db, IEmailService email) : IRequestHandler<DecideSchoolCommand>
    {
        public async Task Handle(DecideSchoolCommand cmd, CancellationToken ct)
        {
            var school = await db.Schools.FirstOrDefaultAsync(s => s.Id == cmd.SchoolId, ct)
                ?? throw new KeyNotFoundException("School not found.");

            var admins = await db.Users
                .Where(u => u.SchoolId == school.Id && u.Role == UserRole.SchoolAdmin)
                .ToListAsync(ct);
            var enrollments = await db.UserSchoolEnrollments
                .Where(e => e.SchoolId == school.Id)
                .ToListAsync(ct);

            if (cmd.Approve)
            {
                school.ApprovalStatus = ApprovalStatus.Approved;
                school.IsActive = true;
                school.SubscriptionExpiresAt ??= DateTime.UtcNow.AddDays(14);
                foreach (var a in admins) { a.ApprovalStatus = ApprovalStatus.Approved; a.IsActive = true; }
                foreach (var e in enrollments) e.Status = EnrollmentStatus.Active;

                foreach (var a in admins)
                    NotificationFactory.Add(db, a.Id, NotificationType.ApprovalGranted,
                        "School approved", $"{school.Name} has been approved. You can now sign in.", school.Id.ToString());
            }
            else
            {
                school.ApprovalStatus = ApprovalStatus.Rejected;
                school.IsActive = false;
                foreach (var a in admins) { a.ApprovalStatus = ApprovalStatus.Rejected; a.IsActive = false; }
                foreach (var e in enrollments) e.Status = EnrollmentStatus.Suspended;

                foreach (var a in admins)
                    NotificationFactory.Add(db, a.Id, NotificationType.ApprovalRejected,
                        "School not approved", $"Registration for {school.Name} was not approved.", school.Id.ToString());
            }

            await db.SaveChangesAsync(ct);

            foreach (var a in admins)
            {
                var (subject, html) = cmd.Approve
                    ? EmailTemplates.Approved($"{a.FirstName} {a.LastName}", school.Name, "/login")
                    : EmailTemplates.Rejected($"{a.FirstName} {a.LastName}", school.Name);
                await email.SendAsync(a.Email, subject, html, ct);
            }
        }
    }

    // ── MEMBERS (SuperAdmin or the member's SchoolAdmin) ──────────
    public record DecideMemberCommand(Guid UserId, bool Approve, bool ActorIsSuperAdmin, Guid? ActorSchoolId)
        : IRequest;

    public sealed class DecideMemberCommandHandler(IAppDbContext db, IEmailService email) : IRequestHandler<DecideMemberCommand>
    {
        public async Task Handle(DecideMemberCommand cmd, CancellationToken ct)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == cmd.UserId, ct)
                ?? throw new KeyNotFoundException("User not found.");

            if (!cmd.ActorIsSuperAdmin && user.SchoolId != cmd.ActorSchoolId)
                throw new UnauthorizedAccessException("You can only approve members of your own school.");
            if (user.Role is not (UserRole.Teacher or UserRole.Student))
                throw new ArgumentException("Only teacher and student registrations are approved here.");

            var enrollments = await db.UserSchoolEnrollments
                .Where(e => e.UserId == user.Id)
                .ToListAsync(ct);

            if (cmd.Approve)
            {
                user.ApprovalStatus = ApprovalStatus.Approved;
                user.IsActive = true;
                foreach (var e in enrollments) e.Status = EnrollmentStatus.Active;
                NotificationFactory.Add(db, user.Id, NotificationType.ApprovalGranted,
                    "Account approved", "Your account has been approved. You can now sign in.");
            }
            else
            {
                user.ApprovalStatus = ApprovalStatus.Rejected;
                user.IsActive = false;
                foreach (var e in enrollments) e.Status = EnrollmentStatus.Suspended;
                NotificationFactory.Add(db, user.Id, NotificationType.ApprovalRejected,
                    "Account not approved", "Your registration was not approved. Please contact your school.");
            }

            await db.SaveChangesAsync(ct);

            var (subject, html) = cmd.Approve
                ? EmailTemplates.Approved($"{user.FirstName} {user.LastName}", "Your account", "/login")
                : EmailTemplates.Rejected($"{user.FirstName} {user.LastName}", "Your account");
            await email.SendAsync(user.Email, subject, html, ct);
        }
    }
}
