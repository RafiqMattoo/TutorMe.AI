using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Enrollments;

public record GetEnrollmentsQuery(Guid? SchoolId, Guid? UserId) : IRequest<IReadOnlyList<UserSchoolEnrollmentDto>>;

public sealed class GetEnrollmentsQueryHandler(IAppDbContext db)
    : IRequestHandler<GetEnrollmentsQuery, IReadOnlyList<UserSchoolEnrollmentDto>>
{
    public async Task<IReadOnlyList<UserSchoolEnrollmentDto>> Handle(GetEnrollmentsQuery q, CancellationToken ct)
    {
        var query = db.UserSchoolEnrollments.AsNoTracking()
            .Include(x => x.User).Include(x => x.School).AsQueryable();

        if (q.SchoolId.HasValue) query = query.Where(x => x.SchoolId == q.SchoolId);
        if (q.UserId.HasValue) query = query.Where(x => x.UserId == q.UserId);

        return await query
            .OrderBy(x => x.School.Name).ThenBy(x => x.User.FirstName)
            .Select(x => new UserSchoolEnrollmentDto(x.Id, x.UserId,
                $"{x.User.FirstName} {x.User.LastName}", x.SchoolId, x.School.Name,
                x.Role, x.Status, x.IsPrimary, x.EnrolledAt))
            .ToListAsync(ct);
    }
}

public record CreateEnrollmentCommand(Guid UserId, Guid SchoolId, UserRole Role, EnrollmentStatus Status, bool IsPrimary) : IRequest<UserSchoolEnrollmentDto>;

public sealed class CreateEnrollmentCommandHandler(IAppDbContext db)
    : IRequestHandler<CreateEnrollmentCommand, UserSchoolEnrollmentDto>
{
    public async Task<UserSchoolEnrollmentDto> Handle(CreateEnrollmentCommand cmd, CancellationToken ct)
    {
        if (await db.UserSchoolEnrollments.AnyAsync(x => x.UserId == cmd.UserId && x.SchoolId == cmd.SchoolId && x.Role == cmd.Role, ct))
            throw new ArgumentException("This user already has that role in the selected school.");

        if (cmd.IsPrimary)
        {
            var existing = await db.UserSchoolEnrollments.Where(x => x.UserId == cmd.UserId).ToListAsync(ct);
            foreach (var row in existing) row.IsPrimary = false;
        }

        var enrollment = new UserSchoolEnrollment
        {
            UserId = cmd.UserId,
            SchoolId = cmd.SchoolId,
            Role = cmd.Role,
            Status = cmd.Status,
            IsPrimary = cmd.IsPrimary,
            EnrolledAt = DateTime.UtcNow
        };
        db.UserSchoolEnrollments.Add(enrollment);
        await db.SaveChangesAsync(ct);

        var user = await db.Users.FindAsync([cmd.UserId], ct);
        var school = await db.Schools.FindAsync([cmd.SchoolId], ct);

        return new UserSchoolEnrollmentDto(enrollment.Id, enrollment.UserId,
            $"{user?.FirstName} {user?.LastName}".Trim(), enrollment.SchoolId,
            school?.Name ?? string.Empty, enrollment.Role, enrollment.Status,
            enrollment.IsPrimary, enrollment.EnrolledAt);
    }
}

public record DeleteEnrollmentCommand(Guid Id) : IRequest;

public sealed class DeleteEnrollmentCommandHandler(IAppDbContext db)
    : IRequestHandler<DeleteEnrollmentCommand>
{
    public async Task Handle(DeleteEnrollmentCommand cmd, CancellationToken ct)
    {
        var enrollment = await db.UserSchoolEnrollments.FindAsync([cmd.Id], ct)
            ?? throw new KeyNotFoundException("Enrollment not found.");
        enrollment.IsDeleted = true;
        await db.SaveChangesAsync(ct);
    }
}

