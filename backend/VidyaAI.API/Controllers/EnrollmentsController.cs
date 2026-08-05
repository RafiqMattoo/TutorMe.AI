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
    [Route("api/enrollments"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class EnrollmentsController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? schoolId = null, [FromQuery] Guid? userId = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetEnrollmentsQuery(IsSuperAdmin ? schoolId : CurrentSchoolId, userId), ct));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserSchoolEnrollmentRequest req, CancellationToken ct)
        {
            if (!IsSuperAdmin && req.SchoolId != CurrentSchoolId)
                return Forbid();
            return Ok(await Sender.Send(new CreateEnrollmentCommand(req.UserId, req.SchoolId, req.Role, req.Status, req.IsPrimary), ct));
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteEnrollmentCommand(id), ct);
            return NoContent();
        }
    }

}
