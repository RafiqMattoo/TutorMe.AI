using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Articles.Commands;
using VidyaAI.Application.Articles.Queries;
using VidyaAI.Application.Auth.Commands;
using VidyaAI.Application.Dashboard.Queries;
using VidyaAI.Application.Deliveries.Commands;
using VidyaAI.Application.Deliveries.Queries;
using VidyaAI.Application.Flashcards.Commands;
using VidyaAI.Application.Flashcards.Queries;
using VidyaAI.Application.LessonPlans.Commands;
using VidyaAI.Application.LessonPlans.Queries;
using VidyaAI.Application.Academics.Commands;
using VidyaAI.Application.Academics.Queries;
using VidyaAI.Application.Students.Commands;
using VidyaAI.Application.Students.Queries;
using VidyaAI.Application.Transport.Commands;
using VidyaAI.Application.Transport.Queries;
using VidyaAI.Application.Approvals.Commands;
using VidyaAI.Application.Approvals.Queries;
using VidyaAI.Application.Materials.Commands;
using VidyaAI.Application.Materials.Queries;
using VidyaAI.Application.Narration.Commands;
using VidyaAI.Application.Narration.Queries;
using VidyaAI.Application.Notifications.Commands;
using VidyaAI.Application.Notifications.Queries;
using VidyaAI.Application.Registration.Commands;
using VidyaAI.Application.Registration.Queries;
using VidyaAI.Application.Quizzes.Commands;
using VidyaAI.Application.Quizzes.Queries;
using VidyaAI.Application.Schools.Commands;
using VidyaAI.Application.Schools.Queries;
using VidyaAI.Application.SimpleBot.Commands;
using VidyaAI.Application.Tutor.Commands;
using VidyaAI.Application.Tutor.Queries;
using VidyaAI.Application.Users.Commands;
using VidyaAI.Application.Users.Queries;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Enrollments;
using VidyaAI.Application.Roles;
using VidyaAI.Domain.Enums;
namespace VidyaAI.API.Controllers
{
    // ── TRANSPORT (D4) ───────────────────────────────────────────────
    // Fleet, routes, stops & per-student allocation with fares. Admin-managed; SuperAdmin
    // operates on a school via ?schoolId=, everyone else is pinned to their own school.
    [Route("api/transport"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class TransportController(ISender sender) : BaseController(sender)
    {
        private Guid Scope(Guid? schoolId)
            => ((IsSuperAdmin ? (schoolId ?? CurrentSchoolId) : CurrentSchoolId))
               ?? throw new InvalidOperationException("A school context is required.");

        // Vehicles
        [HttpGet("vehicles")]
        public async Task<IActionResult> GetVehicles([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetTransportVehiclesQuery(Scope(schoolId)), ct));

        [HttpPost("vehicles")]
        public async Task<IActionResult> SaveVehicle([FromBody] SaveTransportVehicleRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportVehicleCommand(null, Scope(req.SchoolId), req.RegistrationNumber, req.Model, req.Capacity, req.DriverName, req.DriverPhone, req.Notes, req.IsActive), ct));

        [HttpPut("vehicles/{id:guid}")]
        public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] SaveTransportVehicleRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportVehicleCommand(id, Scope(req.SchoolId), req.RegistrationNumber, req.Model, req.Capacity, req.DriverName, req.DriverPhone, req.Notes, req.IsActive), ct));

        [HttpDelete("vehicles/{id:guid}")]
        public async Task<IActionResult> DeleteVehicle(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteTransportVehicleCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Routes
        [HttpGet("routes")]
        public async Task<IActionResult> GetRoutes([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetTransportRoutesQuery(Scope(schoolId)), ct));

        [HttpPost("routes")]
        public async Task<IActionResult> SaveRoute([FromBody] SaveTransportRouteRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportRouteCommand(null, Scope(req.SchoolId), req.Name, req.Code, req.Description, req.VehicleId, req.Fare, req.FeeFrequency, req.IsActive), ct));

        [HttpPut("routes/{id:guid}")]
        public async Task<IActionResult> UpdateRoute(Guid id, [FromBody] SaveTransportRouteRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportRouteCommand(id, Scope(req.SchoolId), req.Name, req.Code, req.Description, req.VehicleId, req.Fare, req.FeeFrequency, req.IsActive), ct));

        [HttpDelete("routes/{id:guid}")]
        public async Task<IActionResult> DeleteRoute(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteTransportRouteCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Stops (scoped to a route)
        [HttpGet("routes/{routeId:guid}/stops")]
        public async Task<IActionResult> GetStops(Guid routeId, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetTransportStopsQuery(Scope(schoolId), routeId), ct));

        [HttpPost("stops")]
        public async Task<IActionResult> SaveStop([FromBody] SaveTransportStopRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportStopCommand(null, Scope(req.SchoolId), req.RouteId, req.Name, req.SortOrder, req.PickupTime, req.DropTime, req.StopFare), ct));

        [HttpPut("stops/{id:guid}")]
        public async Task<IActionResult> UpdateStop(Guid id, [FromBody] SaveTransportStopRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveTransportStopCommand(id, Scope(req.SchoolId), req.RouteId, req.Name, req.SortOrder, req.PickupTime, req.DropTime, req.StopFare), ct));

        [HttpDelete("stops/{id:guid}")]
        public async Task<IActionResult> DeleteStop(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteTransportStopCommand(id, Scope(schoolId)), ct); return NoContent(); }

        // Student allocations
        [HttpGet("allocations")]
        public async Task<IActionResult> GetAllocations([FromQuery] Guid? schoolId, [FromQuery] Guid? routeId, CancellationToken ct)
            => Ok(await Sender.Send(new GetStudentTransportsQuery(Scope(schoolId), routeId), ct));

        [HttpPost("allocations")]
        public async Task<IActionResult> SaveAllocation([FromBody] SaveStudentTransportRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStudentTransportCommand(null, Scope(req.SchoolId), req.StudentId, req.RouteId, req.StopId, req.Fare, req.IsActive), ct));

        [HttpPut("allocations/{id:guid}")]
        public async Task<IActionResult> UpdateAllocation(Guid id, [FromBody] SaveStudentTransportRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStudentTransportCommand(id, Scope(req.SchoolId), req.StudentId, req.RouteId, req.StopId, req.Fare, req.IsActive), ct));

        [HttpDelete("allocations/{id:guid}")]
        public async Task<IActionResult> DeleteAllocation(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteStudentTransportCommand(id, Scope(schoolId)), ct); return NoContent(); }
    }
}
