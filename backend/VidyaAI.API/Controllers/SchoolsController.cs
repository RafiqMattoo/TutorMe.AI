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

    [Route("api/schools"), Authorize(Roles = "SuperAdmin")]
    public sealed class SchoolsController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetSchoolsQuery(page, pageSize, search), ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await Sender.Send(new GetSchoolByIdQuery(id), ct));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSchoolRequest req, CancellationToken ct)
        {
            var result = await Sender.Send(new CreateSchoolCommand(req.Name, req.Address, req.City, req.State, req.Phone, req.Email, req.Type, req.Board, req.Plan), ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSchoolRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new UpdateSchoolCommand(id, req.Name, req.Address, req.City, req.State, req.Phone, req.Email, req.LogoUrl, req.Type, req.Board, req.IsActive, req.Plan, req.SubscriptionStatus, req.SubscriptionExpiresAt), ct));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct) { await Sender.Send(new DeleteSchoolCommand(id), ct); return NoContent(); }
    }
}
