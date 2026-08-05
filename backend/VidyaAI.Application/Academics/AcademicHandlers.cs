using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Academics.Queries
{
    // ── Academic years (+ nested terms) ──────────────────────────
    public record GetAcademicYearsQuery(Guid SchoolId) : IRequest<IReadOnlyList<AcademicYearDto>>;

    public sealed class GetAcademicYearsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetAcademicYearsQuery, IReadOnlyList<AcademicYearDto>>
    {
        public async Task<IReadOnlyList<AcademicYearDto>> Handle(GetAcademicYearsQuery q, CancellationToken ct) =>
            await db.AcademicYears.AsNoTracking()
                .Where(y => y.SchoolId == q.SchoolId)
                .OrderByDescending(y => y.StartDate)
                .Select(y => new AcademicYearDto(
                    y.Id, y.SchoolId, y.Name, y.StartDate, y.EndDate, y.IsCurrent,
                    y.Terms.OrderBy(t => t.SortOrder)
                        .Select(t => new TermDto(t.Id, t.AcademicYearId, t.Name, t.StartDate, t.EndDate, t.SortOrder)).ToList(),
                    y.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Classes ──────────────────────────────────────────────────
    public record GetSchoolClassesQuery(Guid SchoolId) : IRequest<IReadOnlyList<SchoolClassDto>>;

    public sealed class GetSchoolClassesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSchoolClassesQuery, IReadOnlyList<SchoolClassDto>>
    {
        public async Task<IReadOnlyList<SchoolClassDto>> Handle(GetSchoolClassesQuery q, CancellationToken ct) =>
            await db.SchoolClasses.AsNoTracking()
                .Where(c => c.SchoolId == q.SchoolId)
                .OrderBy(c => c.Level)
                .Select(c => new SchoolClassDto(c.Id, c.SchoolId, c.Name, c.Stage, c.Level, c.Sections.Count, c.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Sections (optionally filtered to one class) ──────────────
    public record GetSectionsQuery(Guid SchoolId, Guid? SchoolClassId) : IRequest<IReadOnlyList<SectionDto>>;

    public sealed class GetSectionsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSectionsQuery, IReadOnlyList<SectionDto>>
    {
        public async Task<IReadOnlyList<SectionDto>> Handle(GetSectionsQuery q, CancellationToken ct)
        {
            var query = db.Sections.AsNoTracking()
                .Include(s => s.SchoolClass).Include(s => s.ClassTeacher).Include(s => s.Stream)
                .Where(s => s.SchoolId == q.SchoolId);
            if (q.SchoolClassId.HasValue) query = query.Where(s => s.SchoolClassId == q.SchoolClassId);
            return await query
                .OrderBy(s => s.SchoolClass.Level).ThenBy(s => s.Name)
                .Select(s => new SectionDto(
                    s.Id, s.SchoolId, s.SchoolClassId, s.SchoolClass.Name, s.Name, s.Capacity,
                    s.ClassTeacherId, s.ClassTeacher != null ? s.ClassTeacher.FirstName + " " + s.ClassTeacher.LastName : null,
                    s.StreamId, s.Stream != null ? s.Stream.Name : null,
                    s.CreatedAt))
                .ToListAsync(ct);
        }
    }

    // ── Subjects ─────────────────────────────────────────────────
    public record GetSubjectsQuery(Guid SchoolId) : IRequest<IReadOnlyList<SubjectDto>>;

    public sealed class GetSubjectsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSubjectsQuery, IReadOnlyList<SubjectDto>>
    {
        public async Task<IReadOnlyList<SubjectDto>> Handle(GetSubjectsQuery q, CancellationToken ct) =>
            await db.Subjects.AsNoTracking()
                .Where(s => s.SchoolId == q.SchoolId)
                .OrderBy(s => s.Name)
                .Select(s => new SubjectDto(s.Id, s.SchoolId, s.Name, s.Code, s.MediumOfInstruction, s.IsLanguage, s.IsCoScholastic, s.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Houses ───────────────────────────────────────────────────
    public record GetHousesQuery(Guid SchoolId) : IRequest<IReadOnlyList<HouseDto>>;

    public sealed class GetHousesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetHousesQuery, IReadOnlyList<HouseDto>>
    {
        public async Task<IReadOnlyList<HouseDto>> Handle(GetHousesQuery q, CancellationToken ct) =>
            await db.Houses.AsNoTracking()
                .Include(h => h.HouseMaster)
                .Where(h => h.SchoolId == q.SchoolId)
                .OrderBy(h => h.Name)
                .Select(h => new HouseDto(
                    h.Id, h.SchoolId, h.Name, h.ColorHex, h.HouseMasterId,
                    h.HouseMaster != null ? h.HouseMaster.FirstName + " " + h.HouseMaster.LastName : null, h.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Streams ──────────────────────────────────────────────────
    public record GetStreamsQuery(Guid SchoolId) : IRequest<IReadOnlyList<StreamDto>>;

    public sealed class GetStreamsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetStreamsQuery, IReadOnlyList<StreamDto>>
    {
        public async Task<IReadOnlyList<StreamDto>> Handle(GetStreamsQuery q, CancellationToken ct) =>
            await db.Streams.AsNoTracking()
                .Where(s => s.SchoolId == q.SchoolId)
                .OrderBy(s => s.Name)
                .Select(s => new StreamDto(s.Id, s.SchoolId, s.Name, s.Code, s.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Teachers (minimal options for pickers) ───────────────────
    public record GetSchoolTeachersQuery(Guid SchoolId) : IRequest<IReadOnlyList<TeacherOptionDto>>;

    public sealed class GetSchoolTeachersQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSchoolTeachersQuery, IReadOnlyList<TeacherOptionDto>>
    {
        public async Task<IReadOnlyList<TeacherOptionDto>> Handle(GetSchoolTeachersQuery q, CancellationToken ct) =>
            await db.Users.AsNoTracking()
                .Where(u => u.SchoolId == q.SchoolId && u.Role == UserRole.Teacher && u.IsActive)
                .OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
                .Select(u => new TeacherOptionDto(u.Id, u.FirstName + " " + u.LastName))
                .ToListAsync(ct);
    }

    // ── Subject allocations (subject–teacher–class mapping) ──────
    public record GetSubjectAllocationsQuery(Guid SchoolId, Guid? SchoolClassId)
        : IRequest<IReadOnlyList<SubjectAllocationDto>>;

    public sealed class GetSubjectAllocationsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetSubjectAllocationsQuery, IReadOnlyList<SubjectAllocationDto>>
    {
        public async Task<IReadOnlyList<SubjectAllocationDto>> Handle(GetSubjectAllocationsQuery q, CancellationToken ct)
        {
            var query = db.SubjectAllocations.AsNoTracking()
                .Include(a => a.Subject).Include(a => a.SchoolClass).Include(a => a.Section).Include(a => a.Teacher)
                .Where(a => a.SchoolId == q.SchoolId);
            if (q.SchoolClassId.HasValue) query = query.Where(a => a.SchoolClassId == q.SchoolClassId);
            return await query
                .OrderBy(a => a.SchoolClass.Level).ThenBy(a => a.Subject.Name)
                .Select(a => new SubjectAllocationDto(
                    a.Id, a.SchoolId, a.SubjectId, a.Subject.Name,
                    a.SchoolClassId, a.SchoolClass.Name, a.SectionId, a.Section != null ? a.Section.Name : null,
                    a.TeacherId, a.Teacher.FirstName + " " + a.Teacher.LastName, a.CreatedAt))
                .ToListAsync(ct);
        }
    }

    // ── Grading scales (+ nested bands) ──────────────────────────
    public record GetGradingScalesQuery(Guid SchoolId) : IRequest<IReadOnlyList<GradingScaleDto>>;

    public sealed class GetGradingScalesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetGradingScalesQuery, IReadOnlyList<GradingScaleDto>>
    {
        public async Task<IReadOnlyList<GradingScaleDto>> Handle(GetGradingScalesQuery q, CancellationToken ct) =>
            await db.GradingScales.AsNoTracking()
                .Where(s => s.SchoolId == q.SchoolId)
                .OrderByDescending(s => s.IsDefault).ThenBy(s => s.Name)
                .Select(s => new GradingScaleDto(
                    s.Id, s.SchoolId, s.Name, s.Board, s.IsDefault,
                    s.Bands.OrderByDescending(b => b.MinPercent)
                        .Select(b => new GradeBandDto(b.Id, b.GradingScaleId, b.Grade, b.MinPercent, b.MaxPercent, b.GradePoint, b.Description)).ToList(),
                    s.CreatedAt))
                .ToListAsync(ct);
    }
}

namespace VidyaAI.Application.Academics.Commands
{
    using VidyaAI.Application.Academics.Queries;

    // ── Academic year ────────────────────────────────────────────
    public record SaveAcademicYearCommand(
        Guid? Id, Guid SchoolId, string Name, DateTime StartDate, DateTime EndDate, bool IsCurrent)
        : IRequest<AcademicYearDto>;

    public sealed class SaveAcademicYearCommandValidator : AbstractValidator<SaveAcademicYearCommand>
    {
        public SaveAcademicYearCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
            RuleFor(x => x.EndDate).GreaterThan(x => x.StartDate);
        }
    }

    public sealed class SaveAcademicYearCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveAcademicYearCommand, AcademicYearDto>
    {
        public async Task<AcademicYearDto> Handle(SaveAcademicYearCommand c, CancellationToken ct)
        {
            var y = c.Id is null
                ? new AcademicYear { SchoolId = c.SchoolId }
                : await db.AcademicYears.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Academic year not found.");

            y.Name = c.Name; y.StartDate = c.StartDate; y.EndDate = c.EndDate; y.IsCurrent = c.IsCurrent;
            if (c.Id is null) db.AcademicYears.Add(y); else y.UpdatedAt = DateTime.UtcNow;

            // Only one current year per school.
            if (c.IsCurrent)
            {
                var others = await db.AcademicYears.Where(o => o.SchoolId == c.SchoolId && o.Id != y.Id && o.IsCurrent).ToListAsync(ct);
                foreach (var o in others) o.IsCurrent = false;
            }
            await db.SaveChangesAsync(ct);

            return (await new GetAcademicYearsQueryHandler(db).Handle(new GetAcademicYearsQuery(c.SchoolId), ct))
                .First(d => d.Id == y.Id);
        }
    }

    public record DeleteAcademicYearCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteAcademicYearCommandHandler(IAppDbContext db) : IRequestHandler<DeleteAcademicYearCommand>
    {
        public async Task Handle(DeleteAcademicYearCommand c, CancellationToken ct)
        {
            var y = await db.AcademicYears.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Academic year not found.");
            y.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Term ──────────────────────────────────────────────────────
    public record SaveTermCommand(
        Guid? Id, Guid SchoolId, Guid AcademicYearId, string Name, DateTime StartDate, DateTime EndDate, int SortOrder)
        : IRequest<TermDto>;

    public sealed class SaveTermCommandHandler(IAppDbContext db) : IRequestHandler<SaveTermCommand, TermDto>
    {
        public async Task<TermDto> Handle(SaveTermCommand c, CancellationToken ct)
        {
            var yearExists = await db.AcademicYears.AnyAsync(y => y.Id == c.AcademicYearId && y.SchoolId == c.SchoolId, ct);
            if (!yearExists) throw new KeyNotFoundException("Academic year not found.");

            var t = c.Id is null
                ? new Term { SchoolId = c.SchoolId, AcademicYearId = c.AcademicYearId }
                : await db.Terms.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Term not found.");

            t.Name = c.Name; t.StartDate = c.StartDate; t.EndDate = c.EndDate; t.SortOrder = c.SortOrder;
            if (c.Id is null) db.Terms.Add(t); else t.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return new TermDto(t.Id, t.AcademicYearId, t.Name, t.StartDate, t.EndDate, t.SortOrder);
        }
    }

    public record DeleteTermCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteTermCommandHandler(IAppDbContext db) : IRequestHandler<DeleteTermCommand>
    {
        public async Task Handle(DeleteTermCommand c, CancellationToken ct)
        {
            var t = await db.Terms.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Term not found.");
            t.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Class ─────────────────────────────────────────────────────
    public record SaveSchoolClassCommand(Guid? Id, Guid SchoolId, string Name, SchoolStage Stage, int Level)
        : IRequest<SchoolClassDto>;

    public sealed class SaveSchoolClassCommandValidator : AbstractValidator<SaveSchoolClassCommand>
    {
        public SaveSchoolClassCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
        }
    }

    public sealed class SaveSchoolClassCommandHandler(IAppDbContext db) : IRequestHandler<SaveSchoolClassCommand, SchoolClassDto>
    {
        public async Task<SchoolClassDto> Handle(SaveSchoolClassCommand c, CancellationToken ct)
        {
            var k = c.Id is null
                ? new SchoolClass { SchoolId = c.SchoolId }
                : await db.SchoolClasses.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Class not found.");
            k.Name = c.Name; k.Stage = c.Stage; k.Level = c.Level;
            if (c.Id is null) db.SchoolClasses.Add(k); else k.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            var count = await db.Sections.CountAsync(s => s.SchoolClassId == k.Id, ct);
            return new SchoolClassDto(k.Id, k.SchoolId, k.Name, k.Stage, k.Level, count, k.CreatedAt);
        }
    }

    public record DeleteSchoolClassCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteSchoolClassCommandHandler(IAppDbContext db) : IRequestHandler<DeleteSchoolClassCommand>
    {
        public async Task Handle(DeleteSchoolClassCommand c, CancellationToken ct)
        {
            var k = await db.SchoolClasses.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Class not found.");
            k.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Section ───────────────────────────────────────────────────
    public record SaveSectionCommand(
        Guid? Id, Guid SchoolId, Guid SchoolClassId, string Name, int Capacity, Guid? ClassTeacherId, Guid? StreamId)
        : IRequest<SectionDto>;

    public sealed class SaveSectionCommandValidator : AbstractValidator<SaveSectionCommand>
    {
        public SaveSectionCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.SchoolClassId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(20);
        }
    }

    public sealed class SaveSectionCommandHandler(IAppDbContext db) : IRequestHandler<SaveSectionCommand, SectionDto>
    {
        public async Task<SectionDto> Handle(SaveSectionCommand c, CancellationToken ct)
        {
            var classExists = await db.SchoolClasses.AnyAsync(k => k.Id == c.SchoolClassId && k.SchoolId == c.SchoolId, ct);
            if (!classExists) throw new KeyNotFoundException("Class not found.");
            if (c.StreamId is not null && !await db.Streams.AnyAsync(t => t.Id == c.StreamId && t.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Stream not found.");

            var s = c.Id is null
                ? new Section { SchoolId = c.SchoolId, SchoolClassId = c.SchoolClassId }
                : await db.Sections.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Section not found.");
            s.SchoolClassId = c.SchoolClassId; s.Name = c.Name; s.Capacity = c.Capacity;
            s.ClassTeacherId = c.ClassTeacherId; s.StreamId = c.StreamId;
            if (c.Id is null) db.Sections.Add(s); else s.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetSectionsQueryHandler(db).Handle(new GetSectionsQuery(c.SchoolId, null), ct))
                .First(d => d.Id == s.Id);
        }
    }

    public record DeleteSectionCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteSectionCommandHandler(IAppDbContext db) : IRequestHandler<DeleteSectionCommand>
    {
        public async Task Handle(DeleteSectionCommand c, CancellationToken ct)
        {
            var s = await db.Sections.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Section not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Subject ───────────────────────────────────────────────────
    public record SaveSubjectCommand(
        Guid? Id, Guid SchoolId, string Name, string? Code, string? MediumOfInstruction, bool IsLanguage, bool IsCoScholastic)
        : IRequest<SubjectDto>;

    public sealed class SaveSubjectCommandValidator : AbstractValidator<SaveSubjectCommand>
    {
        public SaveSubjectCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        }
    }

    public sealed class SaveSubjectCommandHandler(IAppDbContext db) : IRequestHandler<SaveSubjectCommand, SubjectDto>
    {
        public async Task<SubjectDto> Handle(SaveSubjectCommand c, CancellationToken ct)
        {
            var s = c.Id is null
                ? new Subject { SchoolId = c.SchoolId }
                : await db.Subjects.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Subject not found.");
            s.Name = c.Name; s.Code = c.Code; s.MediumOfInstruction = c.MediumOfInstruction;
            s.IsLanguage = c.IsLanguage; s.IsCoScholastic = c.IsCoScholastic;
            if (c.Id is null) db.Subjects.Add(s); else s.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return new SubjectDto(s.Id, s.SchoolId, s.Name, s.Code, s.MediumOfInstruction, s.IsLanguage, s.IsCoScholastic, s.CreatedAt);
        }
    }

    public record DeleteSubjectCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteSubjectCommandHandler(IAppDbContext db) : IRequestHandler<DeleteSubjectCommand>
    {
        public async Task Handle(DeleteSubjectCommand c, CancellationToken ct)
        {
            var s = await db.Subjects.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Subject not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── House ─────────────────────────────────────────────────────
    public record SaveHouseCommand(Guid? Id, Guid SchoolId, string Name, string? ColorHex, Guid? HouseMasterId)
        : IRequest<HouseDto>;

    public sealed class SaveHouseCommandValidator : AbstractValidator<SaveHouseCommand>
    {
        public SaveHouseCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
        }
    }

    public sealed class SaveHouseCommandHandler(IAppDbContext db) : IRequestHandler<SaveHouseCommand, HouseDto>
    {
        public async Task<HouseDto> Handle(SaveHouseCommand c, CancellationToken ct)
        {
            var h = c.Id is null
                ? new House { SchoolId = c.SchoolId }
                : await db.Houses.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("House not found.");
            h.Name = c.Name; h.ColorHex = c.ColorHex; h.HouseMasterId = c.HouseMasterId;
            if (c.Id is null) db.Houses.Add(h); else h.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetHousesQueryHandler(db).Handle(new GetHousesQuery(c.SchoolId), ct))
                .First(d => d.Id == h.Id);
        }
    }

    public record DeleteHouseCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteHouseCommandHandler(IAppDbContext db) : IRequestHandler<DeleteHouseCommand>
    {
        public async Task Handle(DeleteHouseCommand c, CancellationToken ct)
        {
            var h = await db.Houses.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("House not found.");
            h.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Stream ────────────────────────────────────────────────────
    public record SaveStreamCommand(Guid? Id, Guid SchoolId, string Name, string? Code) : IRequest<StreamDto>;

    public sealed class SaveStreamCommandValidator : AbstractValidator<SaveStreamCommand>
    {
        public SaveStreamCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
        }
    }

    public sealed class SaveStreamCommandHandler(IAppDbContext db) : IRequestHandler<SaveStreamCommand, StreamDto>
    {
        public async Task<StreamDto> Handle(SaveStreamCommand c, CancellationToken ct)
        {
            var s = c.Id is null
                ? new AcademicStream { SchoolId = c.SchoolId }
                : await db.Streams.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Stream not found.");
            s.Name = c.Name; s.Code = c.Code;
            if (c.Id is null) db.Streams.Add(s); else s.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return new StreamDto(s.Id, s.SchoolId, s.Name, s.Code, s.CreatedAt);
        }
    }

    public record DeleteStreamCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteStreamCommandHandler(IAppDbContext db) : IRequestHandler<DeleteStreamCommand>
    {
        public async Task Handle(DeleteStreamCommand c, CancellationToken ct)
        {
            var s = await db.Streams.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Stream not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Subject allocation ────────────────────────────────────────
    public record SaveSubjectAllocationCommand(
        Guid? Id, Guid SchoolId, Guid SubjectId, Guid SchoolClassId, Guid? SectionId, Guid TeacherId)
        : IRequest<SubjectAllocationDto>;

    public sealed class SaveSubjectAllocationCommandValidator : AbstractValidator<SaveSubjectAllocationCommand>
    {
        public SaveSubjectAllocationCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.SubjectId).NotEmpty();
            RuleFor(x => x.SchoolClassId).NotEmpty();
            RuleFor(x => x.TeacherId).NotEmpty();
        }
    }

    public sealed class SaveSubjectAllocationCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveSubjectAllocationCommand, SubjectAllocationDto>
    {
        public async Task<SubjectAllocationDto> Handle(SaveSubjectAllocationCommand c, CancellationToken ct)
        {
            if (!await db.Subjects.AnyAsync(s => s.Id == c.SubjectId && s.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Subject not found.");
            if (!await db.SchoolClasses.AnyAsync(k => k.Id == c.SchoolClassId && k.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Class not found.");
            if (c.SectionId is not null && !await db.Sections.AnyAsync(s => s.Id == c.SectionId && s.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Section not found.");
            if (!await db.Users.AnyAsync(u => u.Id == c.TeacherId && u.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Teacher not found.");

            var a = c.Id is null
                ? new SubjectAllocation { SchoolId = c.SchoolId }
                : await db.SubjectAllocations.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Allocation not found.");
            a.SubjectId = c.SubjectId; a.SchoolClassId = c.SchoolClassId; a.SectionId = c.SectionId; a.TeacherId = c.TeacherId;
            if (c.Id is null) db.SubjectAllocations.Add(a); else a.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetSubjectAllocationsQueryHandler(db).Handle(new GetSubjectAllocationsQuery(c.SchoolId, null), ct))
                .First(d => d.Id == a.Id);
        }
    }

    public record DeleteSubjectAllocationCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteSubjectAllocationCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteSubjectAllocationCommand>
    {
        public async Task Handle(DeleteSubjectAllocationCommand c, CancellationToken ct)
        {
            var a = await db.SubjectAllocations.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Allocation not found.");
            a.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Grading scale (+ bands) ───────────────────────────────────
    public record SaveGradingScaleCommand(Guid? Id, Guid SchoolId, string Name, BoardType? Board, bool IsDefault)
        : IRequest<GradingScaleDto>;

    public sealed class SaveGradingScaleCommandValidator : AbstractValidator<SaveGradingScaleCommand>
    {
        public SaveGradingScaleCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        }
    }

    public sealed class SaveGradingScaleCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveGradingScaleCommand, GradingScaleDto>
    {
        public async Task<GradingScaleDto> Handle(SaveGradingScaleCommand c, CancellationToken ct)
        {
            var s = c.Id is null
                ? new GradingScale { SchoolId = c.SchoolId }
                : await db.GradingScales.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Grading scale not found.");
            s.Name = c.Name; s.Board = c.Board; s.IsDefault = c.IsDefault;
            if (c.Id is null) db.GradingScales.Add(s); else s.UpdatedAt = DateTime.UtcNow;

            // Only one default scale per school.
            if (c.IsDefault)
            {
                var others = await db.GradingScales.Where(o => o.SchoolId == c.SchoolId && o.Id != s.Id && o.IsDefault).ToListAsync(ct);
                foreach (var o in others) o.IsDefault = false;
            }
            await db.SaveChangesAsync(ct);

            return (await new GetGradingScalesQueryHandler(db).Handle(new GetGradingScalesQuery(c.SchoolId), ct))
                .First(d => d.Id == s.Id);
        }
    }

    public record DeleteGradingScaleCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteGradingScaleCommandHandler(IAppDbContext db) : IRequestHandler<DeleteGradingScaleCommand>
    {
        public async Task Handle(DeleteGradingScaleCommand c, CancellationToken ct)
        {
            var s = await db.GradingScales.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Grading scale not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Grade band ────────────────────────────────────────────────
    public record SaveGradeBandCommand(
        Guid? Id, Guid SchoolId, Guid GradingScaleId, string Grade, decimal MinPercent, decimal MaxPercent,
        decimal? GradePoint, string? Description)
        : IRequest<GradeBandDto>;

    public sealed class SaveGradeBandCommandValidator : AbstractValidator<SaveGradeBandCommand>
    {
        public SaveGradeBandCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.GradingScaleId).NotEmpty();
            RuleFor(x => x.Grade).NotEmpty().MaximumLength(10);
            RuleFor(x => x.MinPercent).InclusiveBetween(0, 100);
            RuleFor(x => x.MaxPercent).InclusiveBetween(0, 100).GreaterThanOrEqualTo(x => x.MinPercent);
        }
    }

    public sealed class SaveGradeBandCommandHandler(IAppDbContext db) : IRequestHandler<SaveGradeBandCommand, GradeBandDto>
    {
        public async Task<GradeBandDto> Handle(SaveGradeBandCommand c, CancellationToken ct)
        {
            if (!await db.GradingScales.AnyAsync(s => s.Id == c.GradingScaleId && s.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Grading scale not found.");

            var b = c.Id is null
                ? new GradeBand { SchoolId = c.SchoolId, GradingScaleId = c.GradingScaleId }
                : await db.GradeBands.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Grade band not found.");
            b.Grade = c.Grade; b.MinPercent = c.MinPercent; b.MaxPercent = c.MaxPercent;
            b.GradePoint = c.GradePoint; b.Description = c.Description;
            if (c.Id is null) db.GradeBands.Add(b); else b.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return new GradeBandDto(b.Id, b.GradingScaleId, b.Grade, b.MinPercent, b.MaxPercent, b.GradePoint, b.Description);
        }
    }

    public record DeleteGradeBandCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteGradeBandCommandHandler(IAppDbContext db) : IRequestHandler<DeleteGradeBandCommand>
    {
        public async Task Handle(DeleteGradeBandCommand c, CancellationToken ct)
        {
            var b = await db.GradeBands.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Grade band not found.");
            b.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
