using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Dashboard.Queries
{
    public record GetDashboardStatsQuery(Guid? SchoolId) : IRequest<DashboardStatsDto>;

    public sealed class GetDashboardStatsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
    {
        public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery q, CancellationToken ct)
        {
            var schoolFilter = q.SchoolId.HasValue;
            var totalSchools = schoolFilter ? 1 : await db.Schools.CountAsync(ct);

            var usersQ = db.Users.AsNoTracking().AsQueryable();
            if (schoolFilter) usersQ = usersQ.Where(u => u.SchoolId == q.SchoolId);

            var articlesQ = db.Articles.AsNoTracking().AsQueryable();
            if (schoolFilter) articlesQ = articlesQ.Where(a => a.SchoolId == q.SchoolId);

            var weekAgo = DateTime.UtcNow.AddDays(-7);

            var topArticles = await articlesQ
                .Where(a => a.Status == ArticleStatus.Published)
                .OrderByDescending(a => a.ViewCount)
                .Take(5)
                .Select(a => new TopArticleDto(a.Id, a.Title, a.ViewCount,
                    a.Likes.Count, a.Comments.Count,
                    $"{a.Author.FirstName} {a.Author.LastName}", a.PublishedAt))
                .ToListAsync(ct);

            var recentActivity = await articlesQ
                .OrderByDescending(a => a.CreatedAt).Take(10)
                .Select(a => new RecentActivityDto("article",
                    $"{(a.Status == ArticleStatus.Published ? "Published" : "Draft created")}: {a.Title}",
                    $"{a.Author.FirstName} {a.Author.LastName}", a.CreatedAt))
                .ToListAsync(ct);

            return new DashboardStatsDto(
                totalSchools,
                await usersQ.CountAsync(ct),
                await articlesQ.CountAsync(ct),
                await usersQ.CountAsync(u => u.Role == UserRole.Student, ct),
                await usersQ.CountAsync(u => u.Role == UserRole.Teacher, ct),
                await articlesQ.CountAsync(a => a.Status == ArticleStatus.Published, ct),
                await articlesQ.CountAsync(a => a.Status == ArticleStatus.Draft, ct),
                await db.Likes.AsNoTracking().CountAsync(ct),
                await db.Comments.AsNoTracking().CountAsync(ct),
                await articlesQ.SumAsync(a => a.ViewCount, ct),
                await usersQ.CountAsync(u => u.CreatedAt >= weekAgo, ct),
                await articlesQ.CountAsync(a => a.CreatedAt >= weekAgo, ct),
                topArticles, recentActivity);
        }
    }
}

namespace VidyaAI.Application.Users.Commands
{
    public record CreateUserCommand(string FirstName, string LastName, string Email,
        string Password, string? Phone, UserRole Role, Guid? SchoolId,
        bool ActorIsSuperAdmin, Guid? ActorSchoolId) : IRequest<UserDto>;

    public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6)
                .Matches(@"[A-Z]").WithMessage("Password must contain uppercase.")
                .Matches(@"[0-9]").WithMessage("Password must contain a digit.");
        }
    }

    public sealed class CreateUserCommandHandler(IAppDbContext db) : IRequestHandler<CreateUserCommand, UserDto>
    {
        public async Task<UserDto> Handle(CreateUserCommand cmd, CancellationToken ct)
        {
            if (await db.Users.AnyAsync(u => u.Email == cmd.Email, ct))
                throw new ArgumentException("A user with this email already exists.");

            if (!cmd.ActorIsSuperAdmin && (cmd.Role is UserRole.SuperAdmin or UserRole.SchoolAdmin))
                throw new UnauthorizedAccessException("School admins cannot create elevated users.");

            var schoolId = cmd.ActorIsSuperAdmin ? cmd.SchoolId : cmd.ActorSchoolId;
            if (!cmd.ActorIsSuperAdmin && schoolId is null)
                throw new UnauthorizedAccessException("School context is required.");

            var user = new User
            {
                FirstName = cmd.FirstName, LastName = cmd.LastName, Email = cmd.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.Password),
                Phone = cmd.Phone, Role = cmd.Role, SchoolId = schoolId,
                IsActive = true, EmailVerified = false
            };
            db.Users.Add(user);
            await db.SaveChangesAsync(ct);

            var school = schoolId.HasValue ? await db.Schools.FindAsync([schoolId], ct) : null;
            return new UserDto(user.Id, user.FirstName, user.LastName, user.Email, user.Phone,
                user.AvatarUrl, user.Role, user.IsActive, user.EmailVerified,
                user.LastLoginAt, user.SchoolId, school?.Name, user.CreatedAt);
        }
    }

    public record ToggleUserActiveCommand(Guid UserId, bool ActorIsSuperAdmin, Guid? ActorSchoolId) : IRequest;
    public sealed class ToggleUserActiveCommandHandler(IAppDbContext db) : IRequestHandler<ToggleUserActiveCommand>
    {
        public async Task Handle(ToggleUserActiveCommand cmd, CancellationToken ct)
        {
            var user = await db.Users.FindAsync([cmd.UserId], ct)
                ?? throw new KeyNotFoundException("User not found.");
            if (!cmd.ActorIsSuperAdmin && user.SchoolId != cmd.ActorSchoolId)
                throw new UnauthorizedAccessException("You can only manage users in your school.");
            if (!cmd.ActorIsSuperAdmin && user.Role is UserRole.SuperAdmin or UserRole.SchoolAdmin)
                throw new UnauthorizedAccessException("School admins cannot change elevated users.");
            user.IsActive = !user.IsActive;
            await db.SaveChangesAsync(ct);
        }
    }

    public record DeleteUserCommand(Guid UserId, bool ActorIsSuperAdmin, Guid? ActorSchoolId) : IRequest;
    public sealed class DeleteUserCommandHandler(IAppDbContext db) : IRequestHandler<DeleteUserCommand>
    {
        public async Task Handle(DeleteUserCommand cmd, CancellationToken ct)
        {
            var user = await db.Users.FindAsync([cmd.UserId], ct)
                ?? throw new KeyNotFoundException("User not found.");
            if (!cmd.ActorIsSuperAdmin && user.SchoolId != cmd.ActorSchoolId)
                throw new UnauthorizedAccessException("You can only manage users in your school.");
            if (!cmd.ActorIsSuperAdmin && user.Role is UserRole.SuperAdmin or UserRole.SchoolAdmin)
                throw new UnauthorizedAccessException("School admins cannot delete elevated users.");
            user.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}

namespace VidyaAI.Application.Users.Queries
{
    public record GetUsersQuery(int Page, int PageSize, string? Search, Guid? SchoolId) : IRequest<PagedResult<UserDto>>;

    public sealed class GetUsersQueryHandler(IAppDbContext db) : IRequestHandler<GetUsersQuery, PagedResult<UserDto>>
    {
        public async Task<PagedResult<UserDto>> Handle(GetUsersQuery q, CancellationToken ct)
        {
            var query = db.Users.AsNoTracking().Include(u => u.School).AsQueryable();
            if (q.SchoolId.HasValue) query = query.Where(u => u.SchoolId == q.SchoolId);
            if (!string.IsNullOrWhiteSpace(q.Search))
                query = query.Where(u => u.Email.Contains(q.Search)
                    || u.FirstName.Contains(q.Search) || u.LastName.Contains(q.Search));

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize)
                .Select(u => new UserDto(u.Id, u.FirstName, u.LastName, u.Email, u.Phone, u.AvatarUrl,
                    u.Role, u.IsActive, u.EmailVerified, u.LastLoginAt,
                    u.SchoolId, u.School != null ? u.School.Name : null, u.CreatedAt))
                .ToListAsync(ct);

            return new PagedResult<UserDto>(items, total, q.Page, q.PageSize);
        }
    }
}
