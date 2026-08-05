using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Students.Queries
{
    // ── Paged, filterable student list ───────────────────────────
    public record GetStudentsQuery(
        Guid SchoolId, int Page, int PageSize, string? Search,
        Guid? SchoolClassId, Guid? SectionId, StudentStatus? Status)
        : IRequest<PagedResult<StudentListDto>>;

    public sealed class GetStudentsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetStudentsQuery, PagedResult<StudentListDto>>
    {
        public async Task<PagedResult<StudentListDto>> Handle(GetStudentsQuery q, CancellationToken ct)
        {
            var query = db.Students.AsNoTracking().Where(s => s.SchoolId == q.SchoolId);

            if (!string.IsNullOrWhiteSpace(q.Search))
            {
                var term = q.Search.Trim().ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(term) ||
                    s.LastName.ToLower().Contains(term) ||
                    s.AdmissionNumber.ToLower().Contains(term) ||
                    (s.RollNumber != null && s.RollNumber.ToLower().Contains(term)));
            }
            if (q.SchoolClassId.HasValue) query = query.Where(s => s.SchoolClassId == q.SchoolClassId);
            if (q.SectionId.HasValue) query = query.Where(s => s.SectionId == q.SectionId);
            if (q.Status.HasValue) query = query.Where(s => s.Status == q.Status);

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderBy(s => s.SchoolClass != null ? s.SchoolClass.Level : 0)
                .ThenBy(s => s.RollNumber).ThenBy(s => s.FirstName)
                .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize)
                .Select(s => new StudentListDto(
                    s.Id, s.AdmissionNumber, s.RollNumber, s.FirstName + " " + s.LastName,
                    s.Gender, s.Category, s.Status,
                    s.SchoolClassId, s.SchoolClass != null ? s.SchoolClass.Name : null,
                    s.Section != null ? s.Section.Name : null, s.PhotoUrl, s.AdmissionDate))
                .ToListAsync(ct);

            return new PagedResult<StudentListDto>(items, total, q.Page, q.PageSize);
        }
    }

    // ── Single student (full profile) ────────────────────────────
    public record GetStudentByIdQuery(Guid Id, Guid SchoolId) : IRequest<StudentDto>;

    public sealed class GetStudentByIdQueryHandler(IAppDbContext db)
        : IRequestHandler<GetStudentByIdQuery, StudentDto>
    {
        public async Task<StudentDto> Handle(GetStudentByIdQuery q, CancellationToken ct)
        {
            var s = await db.Students.AsNoTracking()
                .Include(x => x.SchoolClass).Include(x => x.Section).Include(x => x.House)
                .FirstOrDefaultAsync(x => x.Id == q.Id && x.SchoolId == q.SchoolId, ct)
                ?? throw new KeyNotFoundException("Student not found.");
            return StudentMapping.ToDto(s);
        }
    }

    // ── Minimal student options for pickers (transport/timetable/fees) ──
    public record GetStudentOptionsQuery(Guid SchoolId, string? Search) : IRequest<IReadOnlyList<StudentOptionDto>>;

    public sealed class GetStudentOptionsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetStudentOptionsQuery, IReadOnlyList<StudentOptionDto>>
    {
        public async Task<IReadOnlyList<StudentOptionDto>> Handle(GetStudentOptionsQuery q, CancellationToken ct)
        {
            var query = db.Students.AsNoTracking().Where(s => s.SchoolId == q.SchoolId && s.Status == StudentStatus.Active);
            if (!string.IsNullOrWhiteSpace(q.Search))
            {
                var term = q.Search.Trim().ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(term) || s.LastName.ToLower().Contains(term) ||
                    s.AdmissionNumber.ToLower().Contains(term));
            }
            return await query
                .OrderBy(s => s.FirstName).ThenBy(s => s.LastName).Take(500)
                .Select(s => new StudentOptionDto(
                    s.Id, s.FirstName + " " + s.LastName, s.AdmissionNumber,
                    s.SchoolClass != null ? s.SchoolClass.Name : null))
                .ToListAsync(ct);
        }
    }

    // ── Suggest the next admission number for a school ───────────
    public record GetNextAdmissionNumberQuery(Guid SchoolId) : IRequest<string>;

    public sealed class GetNextAdmissionNumberQueryHandler(IAppDbContext db)
        : IRequestHandler<GetNextAdmissionNumberQuery, string>
    {
        public async Task<string> Handle(GetNextAdmissionNumberQuery q, CancellationToken ct)
        {
            var year = DateTime.UtcNow.Year;
            var prefix = year.ToString();
            var taken = await db.Students.AsNoTracking()
                .Where(s => s.SchoolId == q.SchoolId)
                .Select(s => s.AdmissionNumber)
                .ToListAsync(ct);
            var set = taken.ToHashSet();
            var seq = set.Count + 1;
            string candidate;
            do { candidate = $"{prefix}{seq:D4}"; seq++; } while (set.Contains(candidate));
            return candidate;
        }
    }
}

namespace VidyaAI.Application.Students.Commands
{
    using VidyaAI.Application.Students.Queries;

    public record SaveStudentCommand(Guid? Id, Guid SchoolId, SaveStudentRequest Data) : IRequest<StudentDto>;

    public sealed class SaveStudentCommandValidator : AbstractValidator<SaveStudentCommand>
    {
        public SaveStudentCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Data.AdmissionNumber).NotEmpty().MaximumLength(40);
            RuleFor(x => x.Data.FirstName).NotEmpty().MaximumLength(80);
            RuleFor(x => x.Data.LastName).MaximumLength(80);
            RuleFor(x => x.Data.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Data.Email));
        }
    }

    public sealed class SaveStudentCommandHandler(IAppDbContext db) : IRequestHandler<SaveStudentCommand, StudentDto>
    {
        public async Task<StudentDto> Handle(SaveStudentCommand c, CancellationToken ct)
        {
            var d = c.Data;

            // Admission number must be unique within the school.
            var dupe = await db.Students.AnyAsync(
                s => s.SchoolId == c.SchoolId && s.AdmissionNumber == d.AdmissionNumber && s.Id != (c.Id ?? Guid.Empty), ct);
            if (dupe) throw new InvalidOperationException($"Admission number '{d.AdmissionNumber}' is already in use.");

            // Validate placement references belong to this school.
            if (d.AcademicYearId is not null && !await db.AcademicYears.AnyAsync(x => x.Id == d.AcademicYearId && x.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Academic year not found.");
            if (d.SchoolClassId is not null && !await db.SchoolClasses.AnyAsync(x => x.Id == d.SchoolClassId && x.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Class not found.");
            if (d.SectionId is not null && !await db.Sections.AnyAsync(x => x.Id == d.SectionId && x.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Section not found.");
            if (d.HouseId is not null && !await db.Houses.AnyAsync(x => x.Id == d.HouseId && x.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("House not found.");

            var s = c.Id is null
                ? new Student { SchoolId = c.SchoolId }
                : await db.Students.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Student not found.");

            StudentMapping.Apply(s, d);
            if (c.Id is null) db.Students.Add(s); else s.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return await new GetStudentByIdQueryHandler(db).Handle(new GetStudentByIdQuery(s.Id, c.SchoolId), ct);
        }
    }

    public record DeleteStudentCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteStudentCommandHandler(IAppDbContext db) : IRequestHandler<DeleteStudentCommand>
    {
        public async Task Handle(DeleteStudentCommand c, CancellationToken ct)
        {
            var s = await db.Students.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Student not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}

namespace VidyaAI.Application.Students
{
    using VidyaAI.Application.DTOs;

    // Mapping between the Student entity and its DTOs. ToDto is expression-friendly so it can
    // run inside an EF projection (no client evaluation).
    internal static class StudentMapping
    {
        public static StudentDto ToDto(Student s) => new(
            s.Id, s.SchoolId, s.AdmissionNumber, s.RollNumber,
            s.FirstName, s.LastName, s.Gender, s.DateOfBirth, s.AdmissionDate,
            s.Status, s.PhotoUrl,
            s.AcademicYearId, s.SchoolClassId, s.SchoolClass != null ? s.SchoolClass.Name : null,
            s.SectionId, s.Section != null ? s.Section.Name : null,
            s.HouseId, s.House != null ? s.House.Name : null,
            s.Email, s.Phone, s.Address, s.City, s.State, s.Pincode,
            s.Category, s.BloodGroup, s.Nationality, s.MotherTongue, s.Religion,
            s.IsCwsn, s.CwsnNature, s.IsRte, s.AadhaarNumber, s.ApaarId,
            s.FatherName, s.FatherPhone, s.FatherOccupation,
            s.MotherName, s.MotherPhone, s.MotherOccupation,
            s.GuardianName, s.GuardianPhone, s.GuardianEmail, s.GuardianRelation,
            s.CreatedAt);

        public static void Apply(Student s, SaveStudentRequest d)
        {
            s.AdmissionNumber = d.AdmissionNumber.Trim();
            s.RollNumber = d.RollNumber;
            s.FirstName = d.FirstName.Trim();
            s.LastName = d.LastName.Trim();
            s.Gender = d.Gender;
            s.DateOfBirth = d.DateOfBirth;
            s.AdmissionDate = d.AdmissionDate;
            s.Status = d.Status;
            s.PhotoUrl = d.PhotoUrl;
            s.AcademicYearId = d.AcademicYearId;
            s.SchoolClassId = d.SchoolClassId;
            s.SectionId = d.SectionId;
            s.HouseId = d.HouseId;
            s.Email = d.Email;
            s.Phone = d.Phone;
            s.Address = d.Address;
            s.City = d.City;
            s.State = d.State;
            s.Pincode = d.Pincode;
            s.Category = d.Category;
            s.BloodGroup = d.BloodGroup;
            s.Nationality = d.Nationality;
            s.MotherTongue = d.MotherTongue;
            s.Religion = d.Religion;
            s.IsCwsn = d.IsCwsn;
            s.CwsnNature = d.CwsnNature;
            s.IsRte = d.IsRte;
            s.AadhaarNumber = d.AadhaarNumber;
            s.ApaarId = d.ApaarId;
            s.FatherName = d.FatherName;
            s.FatherPhone = d.FatherPhone;
            s.FatherOccupation = d.FatherOccupation;
            s.MotherName = d.MotherName;
            s.MotherPhone = d.MotherPhone;
            s.MotherOccupation = d.MotherOccupation;
            s.GuardianName = d.GuardianName;
            s.GuardianPhone = d.GuardianPhone;
            s.GuardianEmail = d.GuardianEmail;
            s.GuardianRelation = d.GuardianRelation;
        }
    }
}
