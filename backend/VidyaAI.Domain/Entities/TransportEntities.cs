using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── TRANSPORT (D4) ────────────────────────────────────────────────
// School transport: vehicles (buses), routes with stops, and per-student allocation
// to a route/stop with a captured fare. Tenant-scoped by SchoolId and soft-deleted.
// Full fee invoicing lives in Finance (D1); here we record the transport fare itself.

// A vehicle (bus/van) in the school fleet. Driver is captured inline for the first slice.
public class TransportVehicle : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string RegistrationNumber { get; set; } = string.Empty;   // unique per school
    public string? Model { get; set; }
    public int Capacity { get; set; }
    public string? DriverName { get; set; }
    public string? DriverPhone { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<TransportRoute> Routes { get; set; } = [];
}

// A transport route, optionally served by a vehicle, with a fare billed at a cadence.
public class TransportRoute : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }

    public Guid? VehicleId { get; set; }
    public TransportVehicle? Vehicle { get; set; }

    public decimal Fare { get; set; }
    public TransportFeeFrequency FeeFrequency { get; set; } = TransportFeeFrequency.Monthly;
    public bool IsActive { get; set; } = true;

    public ICollection<TransportStop> Stops { get; set; } = [];
}

// A stop along a route, with optional pickup/drop times and an optional stop-specific fare.
public class TransportStop : BaseEntity
{
    public Guid SchoolId { get; set; }
    public Guid RouteId { get; set; }
    public TransportRoute Route { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string? PickupTime { get; set; }     // "07:45" — string keeps it tz-free for a first slice
    public string? DropTime { get; set; }
    public decimal? StopFare { get; set; }       // overrides route fare for this stop when set
}

// Allocation of a student to a route (and optional stop) with the fare captured at assignment.
public class StudentTransport : BaseEntity
{
    public Guid SchoolId { get; set; }

    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public Guid RouteId { get; set; }
    public TransportRoute Route { get; set; } = null!;

    public Guid? StopId { get; set; }
    public TransportStop? Stop { get; set; }

    public decimal Fare { get; set; }
    public bool IsActive { get; set; } = true;
}
