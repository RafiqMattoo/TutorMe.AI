using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Auth.Commands;
using VidyaAI.Application.Registration.Commands;
using VidyaAI.Application.Registration.Queries;
using VidyaAI.Application.DTOs;
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
                req.Password, req.EstablishmentYear, req.RegistrationNumber,
                docUrl, req.CaptchaToken), ct));
        }

        [HttpPost("register/member")]
        public async Task<IActionResult> RegisterMember([FromBody] RegisterMemberRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new RegisterMemberCommand(
                req.SchoolId, req.Role, req.FirstName, req.LastName, req.Email, req.Password, req.Phone,
                req.GradeLevel, req.RollNumber, req.DateOfBirth, req.GuardianName, req.GuardianPhone,
                null, null, null, req.CaptchaToken), ct));

        // Separate endpoints so frontend calls role-specific APIs instead of a single role-driven endpoint
        [HttpPost("register/teacher")]
        public async Task<IActionResult> RegisterTeacher([FromForm] RegisterTeacherRequest req, IFormFile? qualification, IFormFile? experience, [FromServices] VidyaAI.Application.Common.Interfaces.IStorageService storage, CancellationToken ct)
        {
            string? qualUrl = null;
            string? expUrl = null;
            if (qualification is not null && qualification.Length > 0)
            {
                await using var s = qualification.OpenReadStream();
                qualUrl = await storage.UploadAsync(s, qualification.FileName, qualification.ContentType ?? "application/octet-stream", ct);
            }
            if (experience is not null && experience.Length > 0)
            {
                await using var s2 = experience.OpenReadStream();
                expUrl = await storage.UploadAsync(s2, experience.FileName, experience.ContentType ?? "application/octet-stream", ct);
            }

            return Ok(await Sender.Send(new RegisterMemberCommand(
                req.SchoolId, UserRole.Teacher, req.FirstName, req.LastName, req.Email, req.Password, req.Phone,
                null, null, req.DateOfBirth, null, null, qualUrl, expUrl, null, req.CaptchaToken), ct));
        }

        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromForm] RegisterStudentRequest req, IFormFile? birthCertificate, [FromServices] VidyaAI.Application.Common.Interfaces.IStorageService storage, CancellationToken ct)
        {
            string? birthUrl = null;
            if (birthCertificate is not null && birthCertificate.Length > 0)
            {
                await using var s = birthCertificate.OpenReadStream();
                birthUrl = await storage.UploadAsync(s, birthCertificate.FileName, birthCertificate.ContentType ?? "application/octet-stream", ct);
            }

            return Ok(await Sender.Send(new RegisterMemberCommand(
                req.SchoolId, UserRole.Student, req.FirstName, req.LastName, req.Email, req.Password, req.Phone,
                req.GradeLevel, req.RollNumber, req.DateOfBirth, req.GuardianName, req.GuardianPhone,
                null, null, birthUrl, req.CaptchaToken), ct));
        }

        // [HttpPost("logout"), Authorize]
        // public async Task<IActionResult> Logout(CancellationToken ct)
        // {
        //     await Sender.Send(new LogoutCommand(CurrentUserId), ct);
        //     return NoContent();
        // }
        [HttpPost("logout"), Authorize]

        //----Updated logout endpoint to use refresh token instead of userId for logout----
        public async Task<IActionResult> Logout(
    [FromBody] LogoutRequest req,
    CancellationToken ct)
        {
            await Sender.Send(new LogoutCommand(req.RefreshToken), ct);
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

        // ── FORGOT PASSWORD ───────────────────────────────────────────────
        // Initiates the password reset process.
        // Always returns the same response regardless of whether the email exists
        // to prevent account enumeration attacks.
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromBody] ForgotPasswordRequestDto request,
            CancellationToken ct)
        {
            await Sender.Send(
                new ForgotPasswordCommand(request.Email),
                ct);

            return Ok(new
            {
                success = true,
                message = "If the provided email address is associated with an account, password reset instructions have been sent."
            });
        }

        // Resets the user's password using a valid password reset token.
        [HttpPost("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword(
            [FromBody] ResetPasswordRequestDto req,
            CancellationToken ct)
        {
            await Sender.Send(new ResetPasswordCommand(
                req.Token,
                req.NewPassword,
                req.ConfirmPassword), ct);

            return Ok(new
            {
                message = "Your password has been reset successfully."
            });
        }
    }

}
