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
    // ── DELIVERIES (Delivered Today) ──────────────────────────────────
    [Route("api/deliveries"), Authorize]
    public sealed class DeliveriesController(ISender sender) : BaseController(sender)
    {
        // Teacher / admin: manage deliveries scoped to their school.
        [HttpGet, Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
        public async Task<IActionResult> GetAll([FromQuery] DateOnly? date = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetDeliveriesQuery(IsSuperAdmin ? null : CurrentSchoolId, date), ct));

        // Any logged-in user (students): what's delivered for a given day (defaults to today).
        // The client passes its own local date so "today" is correct in the user's timezone.
        [HttpGet("today")]
        public async Task<IActionResult> GetToday([FromQuery] DateOnly? date = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetTodayDeliveriesQuery(
                IsSuperAdmin ? null : CurrentSchoolId,
                date ?? DateOnly.FromDateTime(DateTime.UtcNow)), ct));

        [HttpPost, Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
        public async Task<IActionResult> Create([FromBody] CreateDeliveryRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new CreateDeliveryCommand(
                req.Title, req.Instructions, req.ScheduledDate, req.GradeLevel,
                req.MaterialId, req.QuizId, req.FlashcardSetId, CurrentUserId, CurrentSchoolId), ct));

        [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteDeliveryCommand(id), ct);
            return NoContent();
        }
    }
}
