using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Roles;

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
