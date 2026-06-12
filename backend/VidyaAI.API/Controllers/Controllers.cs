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
using VidyaAI.Application.Tutor.Commands;
using VidyaAI.Application.Tutor.Queries;
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

    // ── Public self-registration (no auth) ────────────────────────
    [HttpGet("schools")]
    public async Task<IActionResult> PublicSchools(CancellationToken ct)
        => Ok(await Sender.Send(new GetPublicSchoolsQuery(), ct));

    [HttpPost("register/school")]
    public async Task<IActionResult> RegisterSchool([FromBody] RegisterSchoolRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new RegisterSchoolCommand(
            req.SchoolName, req.City, req.State, req.Phone, req.Email, req.Type, req.Board,
            req.AdminFirstName, req.AdminLastName, req.AdminEmail, req.AdminPassword, req.AdminPhone, req.CaptchaToken), ct));

    [HttpPost("register/member")]
    public async Task<IActionResult> RegisterMember([FromBody] RegisterMemberRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new RegisterMemberCommand(
            req.SchoolId, req.Role, req.FirstName, req.LastName, req.Email, req.Password, req.Phone,
            req.GradeLevel, req.RollNumber, req.DateOfBirth, req.GuardianName, req.GuardianPhone, req.CaptchaToken), ct));

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
        => Ok(await Sender.Send(new CreateUserCommand(req.FirstName, req.LastName, req.Email, req.Password, req.Phone, req.Role, req.SchoolId, IsSuperAdmin, CurrentSchoolId,
            req.GradeLevel, req.RollNumber, req.DateOfBirth, req.GuardianName, req.GuardianPhone), ct));

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

// ── MATERIALS ─────────────────────────────────────────────────────
[Route("api/materials"), Authorize]
public sealed class MaterialsController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null, [FromQuery] Guid? schoolId = null, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetMaterialsQuery(page, pageSize, search,
            IsSuperAdmin ? schoolId : CurrentSchoolId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetMaterialByIdQuery(id), ct));

    [HttpGet("{id:guid}/chunks")]
    public async Task<IActionResult> GetChunks(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetMaterialChunksQuery(id), ct));

    [HttpPost("upload"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50 MB
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string? title,
        [FromForm] Guid? categoryId, CancellationToken ct)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "File is required." });
        if (!file.ContentType.Contains("pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only PDF files are supported." });

        await using var stream = file.OpenReadStream();
        var dto = await Sender.Send(new UploadMaterialCommand(
            stream, file.FileName, file.ContentType, file.Length,
            title ?? Path.GetFileNameWithoutExtension(file.FileName),
            categoryId, CurrentSchoolId, CurrentUserId), ct);
        return Ok(dto);
    }

    [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await Sender.Send(new DeleteMaterialCommand(id), ct);
        return NoContent();
    }
}

// ── TUTOR (RAG chat) ──────────────────────────────────────────────
[Route("api/tutor"), Authorize]
public sealed class TutorController(ISender sender) : BaseController(sender)
{
    [HttpGet("sessions")]
    public async Task<IActionResult> GetSessions(CancellationToken ct)
        => Ok(await Sender.Send(new GetChatSessionsQuery(CurrentUserId), ct));

    [HttpGet("sessions/{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetChatMessagesQuery(id, CurrentUserId), ct));

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] AskTutorRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new AskTutorCommand(req.SessionId, req.MaterialId, req.Question, CurrentUserId), ct));

    // Server-Sent Events stream of the answer, token-by-token (ChatGPT-style typing).
    [HttpPost("ask/stream")]
    public async Task AskStream([FromBody] AskTutorRequest req, CancellationToken ct)
    {
        Response.Headers.ContentType = "text/event-stream";
        Response.Headers.CacheControl = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no"; // disable proxy buffering (nginx)
        HttpContext.Features.Get<IHttpResponseBodyFeature>()?.DisableBuffering();

        async Task WriteEventAsync(TutorStreamEvent ev) =>
            await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(ev, SseJson)}\n\n", ct);

        try
        {
            await foreach (var ev in Sender.CreateStream(
                new AskTutorStreamCommand(req.SessionId, req.MaterialId, req.Question, CurrentUserId), ct))
            {
                await WriteEventAsync(ev);
                await Response.Body.FlushAsync(ct);
            }
        }
        catch (Exception ex) when (!ct.IsCancellationRequested)
        {
            await WriteEventAsync(new TutorStreamEvent("error", null, ex.Message, null, null));
            await Response.Body.FlushAsync(ct);
        }
    }

    private static readonly System.Text.Json.JsonSerializerOptions SseJson =
        new(System.Text.Json.JsonSerializerDefaults.Web);

    [HttpDelete("sessions/{id:guid}")]
    public async Task<IActionResult> DeleteSession(Guid id, CancellationToken ct)
    {
        await Sender.Send(new DeleteChatSessionCommand(id, CurrentUserId), ct);
        return NoContent();
    }
}

// ── FLASHCARDS ────────────────────────────────────────────────────
[Route("api/flashcards"), Authorize]
public sealed class FlashcardsController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? materialId = null, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetFlashcardSetsQuery(IsSuperAdmin ? null : CurrentSchoolId, materialId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetFlashcardSetByIdQuery(id), ct));

    [HttpPost("generate"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public async Task<IActionResult> Generate([FromBody] GenerateFlashcardsRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new GenerateFlashcardsCommand(
            req.MaterialId, req.Title, req.Count, CurrentUserId, CurrentSchoolId), ct));

    [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await Sender.Send(new DeleteFlashcardSetCommand(id), ct);
        return NoContent();
    }
}

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

// ── LESSON PLANS (teacher-only) ───────────────────────────────────
[Route("api/lesson-plans"), Authorize]
public sealed class LessonPlansController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? materialId = null, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetLessonPlansQuery(IsSuperAdmin ? null : CurrentSchoolId, materialId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        => Ok(await Sender.Send(new GetLessonPlanByIdQuery(id), ct));

    [HttpPost("generate"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public async Task<IActionResult> Generate([FromBody] GenerateLessonPlanRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new GenerateLessonPlanCommand(
            req.MaterialId, req.Title, req.Subject, req.GradeLevel,
            req.DurationMinutes, CurrentUserId, CurrentSchoolId), ct));

    [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await Sender.Send(new DeleteLessonPlanCommand(id), ct);
        return NoContent();
    }
}

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

// ── NARRATION (audio read-along) ──────────────────────────────────
// Generates a synced audio narration for a material and exposes the timeline used
// by the recite page to highlight text in sync with playback.
[Route("api"), Authorize]
public sealed class NarrationController(ISender sender) : BaseController(sender)
{
    [HttpGet("narration/voices")]
    public async Task<IActionResult> GetVoices(CancellationToken ct)
        => Ok(await Sender.Send(new ListNarrationVoicesQuery(), ct));

    [HttpGet("materials/{id:guid}/narration")]
    public async Task<IActionResult> Get(Guid id, [FromQuery] NarrationKind kind = NarrationKind.Verbatim, CancellationToken ct = default)
        => Ok(await Sender.Send(new GetNarrationQuery(id, kind), ct));

    [HttpPost("materials/{id:guid}/narration")]
    public async Task<IActionResult> Generate(Guid id, [FromBody] GenerateNarrationRequest? req, CancellationToken ct)
        => Ok(await Sender.Send(new GenerateNarrationCommand(id, req?.Voice, req?.Kind ?? NarrationKind.Verbatim), ct));
}

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

// ── NOTIFICATIONS ─────────────────────────────────────────────────
[Route("api/notifications"), Authorize]
public sealed class NotificationsController(ISender sender) : BaseController(sender)
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await Sender.Send(new GetNotificationsQuery(CurrentUserId), ct));

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    { await Sender.Send(new MarkNotificationReadCommand(id, CurrentUserId), ct); return NoContent(); }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken ct)
    { await Sender.Send(new MarkAllNotificationsReadCommand(CurrentUserId), ct); return NoContent(); }
}

// ── ACADEMIC STRUCTURE (A1) ──────────────────────────────────────
// Manage the academic backbone for a school. SuperAdmin operates on a school passed
// via ?schoolId=; everyone else is scoped to their own school (from the JWT).
[Route("api/academics"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
public sealed class AcademicsController(ISender sender) : BaseController(sender)
{
    // Resolve the tenant: a non-SuperAdmin is always pinned to their own school.
    private Guid Scope(Guid? schoolId)
        => ((IsSuperAdmin ? (schoolId ?? CurrentSchoolId) : CurrentSchoolId))
           ?? throw new InvalidOperationException("A school context is required.");

    // Academic years (+ terms)
    [HttpGet("years")]
    public async Task<IActionResult> GetYears([FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new GetAcademicYearsQuery(Scope(schoolId)), ct));

    [HttpPost("years")]
    public async Task<IActionResult> SaveYear([FromBody] SaveAcademicYearRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveAcademicYearCommand(null, Scope(req.SchoolId), req.Name, req.StartDate, req.EndDate, req.IsCurrent), ct));

    [HttpPut("years/{id:guid}")]
    public async Task<IActionResult> UpdateYear(Guid id, [FromBody] SaveAcademicYearRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveAcademicYearCommand(id, Scope(req.SchoolId), req.Name, req.StartDate, req.EndDate, req.IsCurrent), ct));

    [HttpDelete("years/{id:guid}")]
    public async Task<IActionResult> DeleteYear(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteAcademicYearCommand(id, Scope(schoolId)), ct); return NoContent(); }

    [HttpPost("years/{yearId:guid}/terms")]
    public async Task<IActionResult> SaveTerm(Guid yearId, [FromBody] SaveTermRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new SaveTermCommand(null, Scope(schoolId), yearId, req.Name, req.StartDate, req.EndDate, req.SortOrder), ct));

    [HttpPut("terms/{id:guid}")]
    public async Task<IActionResult> UpdateTerm(Guid id, [FromBody] SaveTermRequest req, [FromQuery] Guid yearId, [FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new SaveTermCommand(id, Scope(schoolId), yearId, req.Name, req.StartDate, req.EndDate, req.SortOrder), ct));

    [HttpDelete("terms/{id:guid}")]
    public async Task<IActionResult> DeleteTerm(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteTermCommand(id, Scope(schoolId)), ct); return NoContent(); }

    // Classes
    [HttpGet("classes")]
    public async Task<IActionResult> GetClasses([FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new GetSchoolClassesQuery(Scope(schoolId)), ct));

    [HttpPost("classes")]
    public async Task<IActionResult> SaveClass([FromBody] SaveSchoolClassRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSchoolClassCommand(null, Scope(req.SchoolId), req.Name, req.Stage, req.Level), ct));

    [HttpPut("classes/{id:guid}")]
    public async Task<IActionResult> UpdateClass(Guid id, [FromBody] SaveSchoolClassRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSchoolClassCommand(id, Scope(req.SchoolId), req.Name, req.Stage, req.Level), ct));

    [HttpDelete("classes/{id:guid}")]
    public async Task<IActionResult> DeleteClass(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteSchoolClassCommand(id, Scope(schoolId)), ct); return NoContent(); }

    // Sections
    [HttpGet("sections")]
    public async Task<IActionResult> GetSections([FromQuery] Guid? schoolId, [FromQuery] Guid? classId, CancellationToken ct)
        => Ok(await Sender.Send(new GetSectionsQuery(Scope(schoolId), classId), ct));

    [HttpPost("sections")]
    public async Task<IActionResult> SaveSection([FromBody] SaveSectionRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSectionCommand(null, Scope(schoolId), req.SchoolClassId, req.Name, req.Capacity, req.ClassTeacherId), ct));

    [HttpPut("sections/{id:guid}")]
    public async Task<IActionResult> UpdateSection(Guid id, [FromBody] SaveSectionRequest req, [FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSectionCommand(id, Scope(schoolId), req.SchoolClassId, req.Name, req.Capacity, req.ClassTeacherId), ct));

    [HttpDelete("sections/{id:guid}")]
    public async Task<IActionResult> DeleteSection(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteSectionCommand(id, Scope(schoolId)), ct); return NoContent(); }

    // Subjects
    [HttpGet("subjects")]
    public async Task<IActionResult> GetSubjects([FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new GetSubjectsQuery(Scope(schoolId)), ct));

    [HttpPost("subjects")]
    public async Task<IActionResult> SaveSubject([FromBody] SaveSubjectRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSubjectCommand(null, Scope(req.SchoolId), req.Name, req.Code, req.MediumOfInstruction, req.IsLanguage, req.IsCoScholastic), ct));

    [HttpPut("subjects/{id:guid}")]
    public async Task<IActionResult> UpdateSubject(Guid id, [FromBody] SaveSubjectRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveSubjectCommand(id, Scope(req.SchoolId), req.Name, req.Code, req.MediumOfInstruction, req.IsLanguage, req.IsCoScholastic), ct));

    [HttpDelete("subjects/{id:guid}")]
    public async Task<IActionResult> DeleteSubject(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteSubjectCommand(id, Scope(schoolId)), ct); return NoContent(); }

    // Houses
    [HttpGet("houses")]
    public async Task<IActionResult> GetHouses([FromQuery] Guid? schoolId, CancellationToken ct)
        => Ok(await Sender.Send(new GetHousesQuery(Scope(schoolId)), ct));

    [HttpPost("houses")]
    public async Task<IActionResult> SaveHouse([FromBody] SaveHouseRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveHouseCommand(null, Scope(req.SchoolId), req.Name, req.ColorHex, req.HouseMasterId), ct));

    [HttpPut("houses/{id:guid}")]
    public async Task<IActionResult> UpdateHouse(Guid id, [FromBody] SaveHouseRequest req, CancellationToken ct)
        => Ok(await Sender.Send(new SaveHouseCommand(id, Scope(req.SchoolId), req.Name, req.ColorHex, req.HouseMasterId), ct));

    [HttpDelete("houses/{id:guid}")]
    public async Task<IActionResult> DeleteHouse(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
    { await Sender.Send(new DeleteHouseCommand(id, Scope(schoolId)), ct); return NoContent(); }
}
