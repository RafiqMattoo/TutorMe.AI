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

    // ── QUIZZES ───────────────────────────────────────────────────────
    [Route("api/quizzes"), Authorize]
    public sealed class QuizzesController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? materialId = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetQuizzesQuery(IsSuperAdmin ? null : CurrentSchoolId, materialId), ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetForTaking(Guid id, CancellationToken ct)
            => Ok(await Sender.Send(new GetQuizForTakingQuery(id), ct));

        [HttpPost("generate"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
        public async Task<IActionResult> Generate([FromBody] GenerateQuizRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new GenerateQuizCommand(
                req.MaterialId, req.Title, req.Count, req.Difficulty, CurrentUserId, CurrentSchoolId), ct));

        [HttpPost("{id:guid}/submit")]
        public async Task<IActionResult> Submit(Guid id, [FromBody] SubmitQuizAttemptRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SubmitQuizAttemptCommand(id, CurrentUserId, req.Answers), ct));

        [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteQuizCommand(id), ct);
            return NoContent();
        }
    }
}
