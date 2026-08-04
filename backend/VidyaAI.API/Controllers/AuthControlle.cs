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
        public async Task<IActionResult> RegisterSchool([FromForm] RegisterSchoolRequest req, IFormFile? document, [FromServices] VidyaAI.Application.Common.Interfaces.IStorageService storage, CancellationToken ct)
        {
            string? docUrl = null;
            if (document is not null && document.Length > 0)
            {
                await using var stream = document.OpenReadStream();
                docUrl = await storage.UploadAsync(stream, document.FileName, document.ContentType ?? "application/octet-stream", ct);
            }

            return Ok(await Sender.Send(new RegisterSchoolCommand(
                req.SchoolName, req.City, req.State, req.Phone, req.Email, req.Type, req.Board,
                req.AdminFirstName, req.AdminLastName, req.AdminEmail, req.AdminPassword, req.AdminPhone, docUrl, req.CaptchaToken), ct));
        }

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
        public IActionResult Me() => Ok(new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            email = User.FindFirstValue(ClaimTypes.Email),
            role = User.FindFirstValue(ClaimTypes.Role),
            schoolId = User.FindFirstValue("schoolId")
        });
    }

}
