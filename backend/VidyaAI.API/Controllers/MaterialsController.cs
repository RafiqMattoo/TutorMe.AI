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
}
