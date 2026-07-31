using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Schools.Queries
{
    public record GetSchoolsQuery(int Page, int PageSize, string? Search) : IRequest<PagedResult<SchoolDto>>;

    public sealed class GetSchoolsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSchoolsQuery, PagedResult<SchoolDto>>
    {
        public async Task<PagedResult<SchoolDto>> Handle(GetSchoolsQuery q, CancellationToken ct)
        {
            var query = db.Schools.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(q.Search))
                query = query.Where(s => s.Name.Contains(q.Search) || (s.City != null && s.City.Contains(q.Search)));

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderByDescending(s => s.CreatedAt)
                .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize)
                .Select(s => new SchoolDto(
                    s.Id, s.Name, s.Address, s.City, s.State, s.Phone, s.Email, s.LogoUrl,
                    s.Type, s.Board, s.Plan, s.SubscriptionStatus, s.SubscriptionExpiresAt, s.IsActive,
                    s.Users.Count, s.Articles.Count, s.CreatedAt, s.ApprovalStatus))
                .ToListAsync(ct);

            return new PagedResult<SchoolDto>(items, total, q.Page, q.PageSize);
        }
    }

    public record GetSchoolByIdQuery(Guid Id) : IRequest<SchoolDto>;

    public sealed class GetSchoolByIdQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSchoolByIdQuery, SchoolDto>
    {
        public async Task<SchoolDto> Handle(GetSchoolByIdQuery q, CancellationToken ct)
        {
            var s = await db.Schools.AsNoTracking()
                .Include(x => x.Users).Include(x => x.Articles)
                .FirstOrDefaultAsync(x => x.Id == q.Id, ct)
                ?? throw new KeyNotFoundException($"School {q.Id} not found.");

            return new SchoolDto(s.Id, s.Name, s.Address, s.City, s.State, s.Phone, s.Email, s.LogoUrl,
                s.Type, s.Board, s.Plan, s.SubscriptionStatus, s.SubscriptionExpiresAt, s.IsActive,
                s.Users.Count, s.Articles.Count, s.CreatedAt, s.ApprovalStatus);
        }
    }
}

namespace VidyaAI.Application.Schools.Commands
{
    public record CreateSchoolCommand(
        string Name, string? Address, string? City, string? State,
        string? Phone, string? Email, SchoolType Type, BoardType Board,
        SubscriptionPlan Plan) : IRequest<SchoolDto>;

    public sealed class CreateSchoolCommandValidator : AbstractValidator<CreateSchoolCommand>
    {
        public CreateSchoolCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        }
    }

    public sealed class CreateSchoolCommandHandler(IAppDbContext db)
        : IRequestHandler<CreateSchoolCommand, SchoolDto>
    {
        public async Task<SchoolDto> Handle(CreateSchoolCommand cmd, CancellationToken ct)
        {
            // if (!string.IsNullOrEmpty(cmd.Email) && await db.Schools.AnyAsync(s => s.Email == cmd.Email, ct))
            //     throw new ArgumentException("A school with this email already exists.");
            if (!string.IsNullOrWhiteSpace(cmd.Email) &&
                    await db.Schools.AnyAsync(
                    s => s.Email != null &&
                    s.Email.ToLower() == cmd.Email.ToLower(), ct))
            {
                throw new ArgumentException(
                "School with this email already exists.");
            }
            if (await db.Schools.AnyAsync(
                s => s.Name.ToLower() == cmd.Name.ToLower(), ct))
            {
                throw new ArgumentException(
                    "School with this name already exists.");
            }

            var school = new School
            {
                Name = cmd.Name,
                Address = cmd.Address,
                City = cmd.City,
                State = cmd.State,
                Phone = cmd.Phone,
                Email = cmd.Email,
                Type = cmd.Type,
                Board = cmd.Board,
                Plan = cmd.Plan,
                SubscriptionStatus = SubscriptionStatus.Trial,
                SubscriptionExpiresAt = DateTime.UtcNow.AddDays(14),
                IsActive = true
            };
            db.Schools.Add(school);
            await db.SaveChangesAsync(ct);

            return new SchoolDto(school.Id, school.Name, school.Address, school.City, school.State,
                school.Phone, school.Email, school.LogoUrl, school.Type, school.Board,
                school.Plan, school.SubscriptionStatus, school.SubscriptionExpiresAt,
                school.IsActive, 0, 0, school.CreatedAt, school.ApprovalStatus);
        }
    }

    public record UpdateSchoolCommand(
        Guid Id, string Name, string? Address, string? City, string? State,
        string? Phone, string? Email, string? LogoUrl,
        SchoolType Type, BoardType Board, bool IsActive,
        SubscriptionPlan Plan, SubscriptionStatus SubscriptionStatus,
        DateTime? SubscriptionExpiresAt) : IRequest<SchoolDto>;

    public sealed class UpdateSchoolCommandHandler(IAppDbContext db)
        : IRequestHandler<UpdateSchoolCommand, SchoolDto>
    {
        public async Task<SchoolDto> Handle(UpdateSchoolCommand cmd, CancellationToken ct)
        {
            // Check if the school exists
            var school = await db.Schools.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException($"School {cmd.Id} not found.");
            // Check if the email is already used by another school
            if (!string.IsNullOrWhiteSpace(cmd.Email))
            {
                var emailExists = await db.Schools.AnyAsync(
                    s => s.Id != cmd.Id &&
                         s.Email != null &&
                         s.Email.ToLower() == cmd.Email.ToLower(),
                    ct);

                if (emailExists)
                {
                    throw new ArgumentException(
                        "School with this email already exists.");
                }
            }
            // Check if the name is already used by another school
            school.Name = cmd.Name;
            school.Address = cmd.Address;
            school.City = cmd.City;
            school.State = cmd.State;
            school.Phone = cmd.Phone;
            school.Email = cmd.Email;
            school.LogoUrl = cmd.LogoUrl;
            school.Type = cmd.Type;
            school.Board = cmd.Board;
            school.IsActive = cmd.IsActive;
            school.Plan = cmd.Plan;
            school.SubscriptionStatus = cmd.SubscriptionStatus;
            school.SubscriptionExpiresAt = cmd.SubscriptionExpiresAt;

            await db.SaveChangesAsync(ct);

            return new SchoolDto(
                school.Id,
                school.Name,
                school.Address,
                school.City,
                school.State,
                school.Phone,
                school.Email,
                school.LogoUrl,
                school.Type,
                school.Board,
                school.Plan,
                school.SubscriptionStatus,
                school.SubscriptionExpiresAt,
                school.IsActive,
                0,
                0,
                school.CreatedAt,
                school.ApprovalStatus);
        }
    }
    public record DeleteSchoolCommand(Guid Id) : IRequest;

    public sealed class DeleteSchoolCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteSchoolCommand>
    {
        public async Task Handle(DeleteSchoolCommand cmd, CancellationToken ct)
        {
            var school = await db.Schools.FindAsync([cmd.Id], ct)
                ?? throw new KeyNotFoundException($"School {cmd.Id} not found.");
            school.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
