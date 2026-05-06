using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Articles.Commands;
using VidyaAI.Application.Articles.Queries;
using VidyaAI.Application.Auth.Commands;
using VidyaAI.Application.Dashboard.Queries;
using VidyaAI.Application.Schools.Commands;
using VidyaAI.Application.Schools.Queries;
using VidyaAI.Application.Users.Commands;
using VidyaAI.Application.Users.Queries;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Enrollments;
using VidyaAI.Application.Roles;
using VidyaAI.Domain.Enums;

namespace VidyaAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController(ISender sender) : ControllerBase
{
    protected readonly ISender Sender = sender;
    protected Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    protected Guid? CurrentSchoolId { get { var r = User.FindFirstValue("schoolId"); return string.IsNullOrEmpty(r) ? null : Guid.Parse(r); } }
    protected bool IsSuperAdmin => User.IsInRole(UserRole.SuperAdmin.ToString());
}

[Route("api/auth")]
public sealed class AuthController(ISender sender) : BaseController(sender)
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new LoginCommand(req.Email, req.Password), ct));

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new RefreshTokenCommand(req.RefreshToken), ct));

    [HttpPost("logout"), Authorize]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await Sender.Send(new LogoutCommand(CurrentUserId), ct);
        return NoContent();
    }

    [HttpGet("me"), Authorize]
    public IActionResult Me() => Ok(new {
        id = User.FindFirstValue(ClaimTypes.NameIdentifier),
        email = User.FindFirstValue(ClaimTypes.Email),
        role = User.FindFirstValue(ClaimTypes.Role),
        schoolId = User.FindFirstValue("schoolId")
    });
}

[Route("api/dashboard"), Authorize]
public sealed class DashboardController(ISender sender) : BaseController(sender)
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
        => Ok(await Sender.Send(new GetDashboardStatsQuery(IsSuperAdmin ? null : CurrentSchoolId), ct));
}

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

[Route("api/users"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
public sealed class UsersController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] Guid? schoolId = null, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetUsersQuery(page, pageSize, search, IsSuperAdmin ? schoolId : CurrentSchoolId), ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new CreateUserCommand(req.FirstName, req.LastName, req.Email, req.Password, req.Phone, req.Role, req.SchoolId, IsSuperAdmin, CurrentSchoolId), ct));

    [HttpPatch("{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleActive(Guid id, CancellationToken ct) { await Sender.Send(new ToggleUserActiveCommand(id, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) { await Sender.Send(new DeleteUserCommand(id, IsSuperAdmin, CurrentSchoolId), ct); return NoContent(); }
}

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

[Route("api/articles"), Authorize]
public sealed class ArticlesController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] ArticleStatus? status = null, [FromQuery] Guid? schoolId = null, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetArticlesQuery(page, pageSize, search, status, IsSuperAdmin ? schoolId : CurrentSchoolId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetArticleByIdQuery(id), ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArticleRequest req, CancellationToken ct)
    {
        var result = await Sender.Send(new CreateArticleCommand(req.Title, req.Body, req.CoverImageUrl, req.YoutubeUrl, req.ContentType, req.Tags, req.CategoryId, req.SchoolId ?? CurrentSchoolId, req.ScheduledAt, CurrentUserId), ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateArticleRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new UpdateArticleCommand(id, req.Title, req.Body, req.CoverImageUrl, req.YoutubeUrl, req.ContentType, req.Tags, req.CategoryId, req.ScheduledAt), ct));

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct) { await Sender.Send(new PublishArticleCommand(id), ct); return NoContent(); }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> Unpublish(Guid id, CancellationToken ct) { await Sender.Send(new UnpublishArticleCommand(id), ct); return NoContent(); }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) { await Sender.Send(new DeleteArticleCommand(id), ct); return NoContent(); }
}

// ── CATEGORIES ────────────────────────────────────────────────────
[Route("api/categories")]
[Authorize]
public sealed class CategoriesController(VidyaAI.Infrastructure.Services.CategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await categoryService.GetAllAsync(ct));

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public async Task<IActionResult> Create([FromBody] VidyaAI.Application.DTOs.CreateCategoryRequest req, CancellationToken ct)
        => Ok(await categoryService.CreateAsync(req, ct));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,SchoolAdmin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] VidyaAI.Application.DTOs.UpdateCategoryRequest req, CancellationToken ct)
        => Ok(await categoryService.UpdateAsync(id, req, ct));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await categoryService.DeleteAsync(id, ct);
        return NoContent();
    }
}
