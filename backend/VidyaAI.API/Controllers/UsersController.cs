using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Users.Commands;
using VidyaAI.Application.Users.Queries;
using VidyaAI.Application.DTOs;


namespace VidyaAI.API.Controllers
{
    [Route("api/users"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public sealed class UsersController(ISender sender) : BaseController(sender)
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] Guid? schoolId = null, CancellationToken ct = default)
            => Ok(await Sender.Send(new GetUsersQuery(page, pageSize, search, IsSuperAdmin ? schoolId : CurrentSchoolId), ct));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new CreateUserCommand(req.FirstName, req.LastName, req.Email, req.Password, req.Phone, req.Role, req.SchoolId, IsSuperAdmin, CurrentSchoolId,
                req.GradeLevel, req.RollNumber, req.DateOfBirth, req.GuardianName, req.GuardianPhone), ct));

        [HttpPatch("{id:guid}/toggle-active")]
        public async Task<IActionResult> ToggleActive(Guid id, CancellationToken ct) { await Sender.Send(new ToggleUserActiveCommand(id, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct) { await Sender.Send(new DeleteUserCommand(id, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }
    }
}
