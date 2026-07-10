using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Transport.Queries
{
    // ── Vehicles ─────────────────────────────────────────────────
    public record GetTransportVehiclesQuery(Guid SchoolId) : IRequest<IReadOnlyList<TransportVehicleDto>>;

    public sealed class GetTransportVehiclesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetTransportVehiclesQuery, IReadOnlyList<TransportVehicleDto>>
    {
        public async Task<IReadOnlyList<TransportVehicleDto>> Handle(GetTransportVehiclesQuery q, CancellationToken ct) =>
            await db.TransportVehicles.AsNoTracking()
                .Where(v => v.SchoolId == q.SchoolId)
                .OrderBy(v => v.RegistrationNumber)
                .Select(v => new TransportVehicleDto(
                    v.Id, v.SchoolId, v.RegistrationNumber, v.Model, v.Capacity,
                    v.DriverName, v.DriverPhone, v.Notes, v.IsActive, v.Routes.Count, v.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Routes ───────────────────────────────────────────────────
    public record GetTransportRoutesQuery(Guid SchoolId) : IRequest<IReadOnlyList<TransportRouteDto>>;

    public sealed class GetTransportRoutesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetTransportRoutesQuery, IReadOnlyList<TransportRouteDto>>
    {
        public async Task<IReadOnlyList<TransportRouteDto>> Handle(GetTransportRoutesQuery q, CancellationToken ct) =>
            await db.TransportRoutes.AsNoTracking()
                .Where(r => r.SchoolId == q.SchoolId)
                .OrderBy(r => r.Name)
                .Select(r => new TransportRouteDto(
                    r.Id, r.SchoolId, r.Name, r.Code, r.Description,
                    r.VehicleId, r.Vehicle != null ? r.Vehicle.RegistrationNumber : null,
                    r.Fare, r.FeeFrequency, r.IsActive,
                    r.Stops.Count,
                    db.StudentTransports.Count(st => st.RouteId == r.Id),
                    r.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Stops (for one route) ────────────────────────────────────
    public record GetTransportStopsQuery(Guid SchoolId, Guid RouteId) : IRequest<IReadOnlyList<TransportStopDto>>;

    public sealed class GetTransportStopsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetTransportStopsQuery, IReadOnlyList<TransportStopDto>>
    {
        public async Task<IReadOnlyList<TransportStopDto>> Handle(GetTransportStopsQuery q, CancellationToken ct) =>
            await db.TransportStops.AsNoTracking()
                .Where(s => s.SchoolId == q.SchoolId && s.RouteId == q.RouteId)
                .OrderBy(s => s.SortOrder).ThenBy(s => s.Name)
                .Select(s => new TransportStopDto(
                    s.Id, s.SchoolId, s.RouteId, s.Name, s.SortOrder, s.PickupTime, s.DropTime, s.StopFare, s.CreatedAt))
                .ToListAsync(ct);
    }

    // ── Student transport allocations (optionally filtered to a route) ──
    public record GetStudentTransportsQuery(Guid SchoolId, Guid? RouteId) : IRequest<IReadOnlyList<StudentTransportDto>>;

    public sealed class GetStudentTransportsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetStudentTransportsQuery, IReadOnlyList<StudentTransportDto>>
    {
        public async Task<IReadOnlyList<StudentTransportDto>> Handle(GetStudentTransportsQuery q, CancellationToken ct)
        {
            var query = db.StudentTransports.AsNoTracking()
                .Include(t => t.Student).Include(t => t.Route).Include(t => t.Stop)
                .Where(t => t.SchoolId == q.SchoolId);
            if (q.RouteId.HasValue) query = query.Where(t => t.RouteId == q.RouteId);
            return await query
                .OrderBy(t => t.Route.Name).ThenBy(t => t.Student.FirstName)
                .Select(t => new StudentTransportDto(
                    t.Id, t.SchoolId, t.StudentId, t.Student.FirstName + " " + t.Student.LastName, t.Student.AdmissionNumber,
                    t.RouteId, t.Route.Name, t.StopId, t.Stop != null ? t.Stop.Name : null,
                    t.Fare, t.IsActive, t.CreatedAt))
                .ToListAsync(ct);
        }
    }
}

namespace VidyaAI.Application.Transport.Commands
{
    using VidyaAI.Application.Transport.Queries;

    // ── Vehicle ──────────────────────────────────────────────────
    public record SaveTransportVehicleCommand(
        Guid? Id, Guid SchoolId, string RegistrationNumber, string? Model, int Capacity,
        string? DriverName, string? DriverPhone, string? Notes, bool IsActive)
        : IRequest<TransportVehicleDto>;

    public sealed class SaveTransportVehicleCommandValidator : AbstractValidator<SaveTransportVehicleCommand>
    {
        public SaveTransportVehicleCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.RegistrationNumber).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Capacity).GreaterThanOrEqualTo(0);
        }
    }

    public sealed class SaveTransportVehicleCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveTransportVehicleCommand, TransportVehicleDto>
    {
        public async Task<TransportVehicleDto> Handle(SaveTransportVehicleCommand c, CancellationToken ct)
        {
            var dupe = await db.TransportVehicles.AnyAsync(
                v => v.SchoolId == c.SchoolId && v.RegistrationNumber == c.RegistrationNumber && v.Id != (c.Id ?? Guid.Empty), ct);
            if (dupe) throw new InvalidOperationException($"Vehicle '{c.RegistrationNumber}' already exists.");

            var v = c.Id is null
                ? new TransportVehicle { SchoolId = c.SchoolId }
                : await db.TransportVehicles.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Vehicle not found.");
            v.RegistrationNumber = c.RegistrationNumber.Trim(); v.Model = c.Model; v.Capacity = c.Capacity;
            v.DriverName = c.DriverName; v.DriverPhone = c.DriverPhone; v.Notes = c.Notes; v.IsActive = c.IsActive;
            if (c.Id is null) db.TransportVehicles.Add(v); else v.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetTransportVehiclesQueryHandler(db).Handle(new GetTransportVehiclesQuery(c.SchoolId), ct))
                .First(d => d.Id == v.Id);
        }
    }

    public record DeleteTransportVehicleCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteTransportVehicleCommandHandler(IAppDbContext db) : IRequestHandler<DeleteTransportVehicleCommand>
    {
        public async Task Handle(DeleteTransportVehicleCommand c, CancellationToken ct)
        {
            var v = await db.TransportVehicles.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Vehicle not found.");
            v.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Route ────────────────────────────────────────────────────
    public record SaveTransportRouteCommand(
        Guid? Id, Guid SchoolId, string Name, string? Code, string? Description, Guid? VehicleId,
        decimal Fare, TransportFeeFrequency FeeFrequency, bool IsActive)
        : IRequest<TransportRouteDto>;

    public sealed class SaveTransportRouteCommandValidator : AbstractValidator<SaveTransportRouteCommand>
    {
        public SaveTransportRouteCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
            RuleFor(x => x.Fare).GreaterThanOrEqualTo(0);
        }
    }

    public sealed class SaveTransportRouteCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveTransportRouteCommand, TransportRouteDto>
    {
        public async Task<TransportRouteDto> Handle(SaveTransportRouteCommand c, CancellationToken ct)
        {
            if (c.VehicleId is not null && !await db.TransportVehicles.AnyAsync(v => v.Id == c.VehicleId && v.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Vehicle not found.");

            var r = c.Id is null
                ? new TransportRoute { SchoolId = c.SchoolId }
                : await db.TransportRoutes.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Route not found.");
            r.Name = c.Name; r.Code = c.Code; r.Description = c.Description; r.VehicleId = c.VehicleId;
            r.Fare = c.Fare; r.FeeFrequency = c.FeeFrequency; r.IsActive = c.IsActive;
            if (c.Id is null) db.TransportRoutes.Add(r); else r.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetTransportRoutesQueryHandler(db).Handle(new GetTransportRoutesQuery(c.SchoolId), ct))
                .First(d => d.Id == r.Id);
        }
    }

    public record DeleteTransportRouteCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteTransportRouteCommandHandler(IAppDbContext db) : IRequestHandler<DeleteTransportRouteCommand>
    {
        public async Task Handle(DeleteTransportRouteCommand c, CancellationToken ct)
        {
            var r = await db.TransportRoutes.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Route not found.");
            r.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Stop ─────────────────────────────────────────────────────
    public record SaveTransportStopCommand(
        Guid? Id, Guid SchoolId, Guid RouteId, string Name, int SortOrder,
        string? PickupTime, string? DropTime, decimal? StopFare)
        : IRequest<TransportStopDto>;

    public sealed class SaveTransportStopCommandValidator : AbstractValidator<SaveTransportStopCommand>
    {
        public SaveTransportStopCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.RouteId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        }
    }

    public sealed class SaveTransportStopCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveTransportStopCommand, TransportStopDto>
    {
        public async Task<TransportStopDto> Handle(SaveTransportStopCommand c, CancellationToken ct)
        {
            if (!await db.TransportRoutes.AnyAsync(r => r.Id == c.RouteId && r.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Route not found.");

            var s = c.Id is null
                ? new TransportStop { SchoolId = c.SchoolId, RouteId = c.RouteId }
                : await db.TransportStops.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Stop not found.");
            s.RouteId = c.RouteId; s.Name = c.Name; s.SortOrder = c.SortOrder;
            s.PickupTime = c.PickupTime; s.DropTime = c.DropTime; s.StopFare = c.StopFare;
            if (c.Id is null) db.TransportStops.Add(s); else s.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return new TransportStopDto(s.Id, s.SchoolId, s.RouteId, s.Name, s.SortOrder, s.PickupTime, s.DropTime, s.StopFare, s.CreatedAt);
        }
    }

    public record DeleteTransportStopCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteTransportStopCommandHandler(IAppDbContext db) : IRequestHandler<DeleteTransportStopCommand>
    {
        public async Task Handle(DeleteTransportStopCommand c, CancellationToken ct)
        {
            var s = await db.TransportStops.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Stop not found.");
            s.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }

    // ── Student allocation ───────────────────────────────────────
    public record SaveStudentTransportCommand(
        Guid? Id, Guid SchoolId, Guid StudentId, Guid RouteId, Guid? StopId, decimal Fare, bool IsActive)
        : IRequest<StudentTransportDto>;

    public sealed class SaveStudentTransportCommandValidator : AbstractValidator<SaveStudentTransportCommand>
    {
        public SaveStudentTransportCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.StudentId).NotEmpty();
            RuleFor(x => x.RouteId).NotEmpty();
            RuleFor(x => x.Fare).GreaterThanOrEqualTo(0);
        }
    }

    public sealed class SaveStudentTransportCommandHandler(IAppDbContext db)
        : IRequestHandler<SaveStudentTransportCommand, StudentTransportDto>
    {
        public async Task<StudentTransportDto> Handle(SaveStudentTransportCommand c, CancellationToken ct)
        {
            if (!await db.Students.AnyAsync(s => s.Id == c.StudentId && s.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Student not found.");
            if (!await db.TransportRoutes.AnyAsync(r => r.Id == c.RouteId && r.SchoolId == c.SchoolId, ct))
                throw new KeyNotFoundException("Route not found.");
            if (c.StopId is not null && !await db.TransportStops.AnyAsync(s => s.Id == c.StopId && s.SchoolId == c.SchoolId && s.RouteId == c.RouteId, ct))
                throw new KeyNotFoundException("Stop not found on this route.");

            var t = c.Id is null
                ? new StudentTransport { SchoolId = c.SchoolId }
                : await db.StudentTransports.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                    ?? throw new KeyNotFoundException("Allocation not found.");
            t.StudentId = c.StudentId; t.RouteId = c.RouteId; t.StopId = c.StopId; t.Fare = c.Fare; t.IsActive = c.IsActive;
            if (c.Id is null) db.StudentTransports.Add(t); else t.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            return (await new GetStudentTransportsQueryHandler(db).Handle(new GetStudentTransportsQuery(c.SchoolId, null), ct))
                .First(d => d.Id == t.Id);
        }
    }

    public record DeleteStudentTransportCommand(Guid Id, Guid SchoolId) : IRequest;

    public sealed class DeleteStudentTransportCommandHandler(IAppDbContext db) : IRequestHandler<DeleteStudentTransportCommand>
    {
        public async Task Handle(DeleteStudentTransportCommand c, CancellationToken ct)
        {
            var t = await db.StudentTransports.FirstOrDefaultAsync(x => x.Id == c.Id && x.SchoolId == c.SchoolId, ct)
                ?? throw new KeyNotFoundException("Allocation not found.");
            t.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
