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
    [Route("api/roles"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class RolesController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetRoles(CancellationToken ct)
            => Ok(await Sender.Send(new GetRoleDefinitionsQuery(), ct));

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDefinitionRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new CreateRoleDefinitionCommand(req.Name, req.DisplayName, req.Description, req.IsActive), ct));

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleDefinitionRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new UpdateRoleDefinitionCommand(id, req.DisplayName, req.Description, req.IsActive), ct));

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteRole(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteRoleDefinitionCommand(id), ct);
            return NoContent();
        }

        [HttpGet("permissions")]
        public async Task<IActionResult> GetPermissions([FromQuery] Guid? roleDefinitionId = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetRolePermissionsQuery(roleDefinitionId), ct));

        [HttpPost("permissions")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpsertPermission([FromBody] UpsertRolePermissionRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new UpsertRolePermissionCommand(req.RoleDefinitionId, req.Module, req.CanView, req.CanCreate, req.CanEdit, req.CanDelete, req.CanApprove), ct));

        [HttpDelete("permissions/{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeletePermission(Guid id, CancellationToken ct)
        {
            await Sender.Send(new DeleteRolePermissionCommand(id), ct);
            return NoContent();
        }
    }
}
