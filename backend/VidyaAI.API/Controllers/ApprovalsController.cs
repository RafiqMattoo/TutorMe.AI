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
    // ── APPROVALS (self-registration review) ──────────────────────────
    // Tiered: SuperAdmin reviews schools; SuperAdmin + SchoolAdmin review members
    // (a SchoolAdmin is scoped to their own school by the handlers).
    [Route("api/approvals"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class ApprovalsController(ISender sender) : BaseController(sender)
    {
        [HttpGet("schools"), Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> PendingSchools(CancellationToken ct)
            => Ok(await Sender.Send(new GetPendingSchoolsQuery(), ct));

        [HttpPost("schools/{id:guid}/approve"), Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ApproveSchool(Guid id, CancellationToken ct)
        { await Sender.Send(new DecideSchoolCommand(id, true), ct); return NoContent(); }

        [HttpPost("schools/{id:guid}/reject"), Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> RejectSchool(Guid id, CancellationToken ct)
        { await Sender.Send(new DecideSchoolCommand(id, false), ct); return NoContent(); }

        [HttpGet("members")]
        public async Task<IActionResult> PendingMembers(CancellationToken ct)
            => Ok(await Sender.Send(new GetPendingMembersQuery(IsSuperAdmin, CurrentSchoolId), ct));

        [HttpPost("members/{id:guid}/approve")]
        public async Task<IActionResult> ApproveMember(Guid id, CancellationToken ct)
        { await Sender.Send(new DecideMemberCommand(id, true, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }

        [HttpPost("members/{id:guid}/reject")]
        public async Task<IActionResult> RejectMember(Guid id, CancellationToken ct)
        { await Sender.Send(new DecideMemberCommand(id, false, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }
    }
}
