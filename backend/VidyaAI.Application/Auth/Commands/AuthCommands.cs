using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;
using VidyaAI.Application.Common;

namespace VidyaAI.Application.Auth.Commands;

// ── LOGIN COMMAND ─────────────────────────────────────────────────
public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Valid email required.");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Password required.");
    }
}

public sealed class LoginCommandHandler(
    IAppDbContext db, IJwtService jwt, IConfiguration config)
    : IRequestHandler<LoginCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(LoginCommand req, CancellationToken ct)
    {
        var user = await db.Users
            .Include(u => u.School)
            .FirstOrDefaultAsync(u => u.Email == req.Email && !u.IsDeleted, ct)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        // Surface a clear reason when a correct password still can't sign in, so
        // self-registered users understand they're waiting on approval.
        if (user.ApprovalStatus == ApprovalStatus.Pending)
            throw new UnauthorizedAccessException("Your account is awaiting approval. You'll be able to sign in once an administrator approves it.");
        if (user.ApprovalStatus == ApprovalStatus.Rejected)
            throw new UnauthorizedAccessException("Your registration was not approved. Please contact your administrator.");
        if (!user.IsActive)
            throw new UnauthorizedAccessException("Your account is deactivated. Please contact your administrator.");
        if (user.School is { IsActive: false } || user.School is { ApprovalStatus: ApprovalStatus.Pending })
            throw new UnauthorizedAccessException("Your school is still awaiting approval. Please try again later.");

        var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Role.ToString(), user.SchoolId);
        var refreshToken = jwt.GenerateRefreshToken();
        var refreshDays = int.Parse(config["Jwt:RefreshExpiryDays"] ?? "7");

        // // Update the last successful login time
        // user.LastLoginAt = DateTime.UtcNow;
        // user.RefreshToken = refreshToken;
        // user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshDays);
        // await db.SaveChangesAsync(ct);

        // Update the last successful login time
        user.LastLoginAt = DateTime.UtcNow;

        // Create a login session
        var session = new Session
        {
            UserId = user.Id,
            RefreshToken = refreshToken,
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshDays),

            DeviceName = null,
            IpAddress = null,
            UserAgent = null,

            IsRevoked = false
        };

        // Save the session
        db.Sessions.Add(session);

        // Save all changes
        await db.SaveChangesAsync(ct);

        return new LoginResponse(accessToken, refreshToken, MapUser(user));
    }

    private static UserDto MapUser(User u) => new(
        u.Id, u.FirstName, u.LastName, u.Email, u.Phone, u.AvatarUrl,
        u.Role, u.IsActive, u.EmailVerified, u.LastLoginAt,
        u.SchoolId, u.School?.Name, u.CreatedAt,
        u.ApprovalStatus, u.GradeLevel, u.RollNumber, u.DateOfBirth, u.GuardianName, u.GuardianPhone);
}

// ── REFRESH TOKEN COMMAND ─────────────────────────────────────────
public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponse>;

public sealed class RefreshTokenCommandHandler(
    IAppDbContext db, IJwtService jwt)
    : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(RefreshTokenCommand req, CancellationToken ct)
    {

        // var user = await db.Users
        //     .Include(u => u.School)
        //     .FirstOrDefaultAsync(u => u.RefreshToken == req.RefreshToken
        //         && u.RefreshTokenExpiry > DateTime.UtcNow && !u.IsDeleted, ct)
        //     ?? throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        //----- updated to use Sessions table instead of Users table for refresh token validation -----

        var session = await db.Sessions
    .Include(s => s.User)
        .ThenInclude(u => u.School)
    .FirstOrDefaultAsync(s =>
    s.RefreshToken == req.RefreshToken &&
    s.RefreshTokenExpiry > DateTime.UtcNow &&
    !s.IsRevoked &&
    !s.User.IsDeleted,
    ct)

    ?? throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        var user = session.User;
        user.LastLoginAt = DateTime.UtcNow;

        var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Role.ToString(), user.SchoolId);
        //--------------update refresh token and expiry------------------
        // var newRefresh = jwt.GenerateRefreshToken();
        // user.RefreshToken = newRefresh;
        // user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        // await db.SaveChangesAsync(ct);

        var newRefresh = jwt.GenerateRefreshToken();

        session.RefreshToken = newRefresh;
        session.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await db.SaveChangesAsync(ct);

        return new LoginResponse(accessToken, newRefresh, new UserDto(
            user.Id, user.FirstName, user.LastName, user.Email, user.Phone, user.AvatarUrl,
            user.Role, user.IsActive, user.EmailVerified, user.LastLoginAt,
            user.SchoolId, user.School?.Name, user.CreatedAt,
            user.ApprovalStatus, user.GradeLevel, user.RollNumber, user.DateOfBirth, user.GuardianName, user.GuardianPhone));
    }
}

// ── Updated  LOGOUT COMMAND ────────────────────────────────────────────────
//public record LogoutCommand(Guid UserId) : IRequest;
public record LogoutCommand(string RefreshToken) : IRequest;

public sealed class LogoutCommandHandler(IAppDbContext db) : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand req, CancellationToken ct)
    {
        // var user = await db.Users.FindAsync([req.UserId], ct);
        // if (user is null) return;
        // user.RefreshToken = null;
        // user.RefreshTokenExpiry = null;
        // await db.SaveChangesAsync(ct);
        var session = await db.Sessions
    .FirstOrDefaultAsync(s =>
        s.RefreshToken == req.RefreshToken &&
        !s.IsRevoked,
        ct);

        if (session is null)
            return;

        session.IsRevoked = true;
        session.RevokedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }
}
// ── FORGOT PASSWORD COMMAND ─────────────────────────────────────

public record ForgotPasswordCommand(string Email) : IRequest;

public sealed class ForgotPasswordCommandValidator
    : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}

// ── FORGOT PASSWORD HANDLER ──────────────────────────────────────

public sealed class ForgotPasswordCommandHandler(
    IAppDbContext db,
    IEmailService email)
    : IRequestHandler<ForgotPasswordCommand>
{
    public async Task Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        // Find the user by email.
        // Ignore deleted users.
        var user = await db.Users
            .FirstOrDefaultAsync(x =>
                x.Email == request.Email &&
                !x.IsDeleted,
                ct);

        // SECURITY:
        // Never reveal whether an email exists.
        // Simply return if the account isn't found.
        if (user is null)
            return;

        // Find any previous unused password reset tokens.
        var existingTokens = await db.OneTimeTokens
            .Where(x =>
                x.UserId == user.Id &&
                x.Purpose == OneTimeTokenPurpose.PasswordReset &&
                !x.IsUsed)
            .ToListAsync(ct);

        // Remove old tokens so only one valid reset token exists.
        db.OneTimeTokens.RemoveRange(existingTokens);

        // Generate a new secure reset token.
        var token = Guid.NewGuid().ToString("N");

        // Save the token in the database.
        db.OneTimeTokens.Add(new OneTimeToken
        {
            UserId = user.Id,
            Token = token,
            Purpose = OneTimeTokenPurpose.PasswordReset,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        });

        // Persist changes before sending the email.
        await db.SaveChangesAsync(ct);

        // Build the email using the shared template.
        var template = EmailTemplates.PasswordReset(
            user.FirstName,
            token);

        // Send the password reset email.
        await email.SendAsync(
            user.Email,
            template.Subject,
            template.Html,
            ct);
    }
}

// ── RESET PASSWORD COMMAND ───────────────────────────────────────

public record ResetPasswordCommand(
    string Token,
    string NewPassword,
    string ConfirmPassword) : IRequest;

//------------------ RESET PASSWORD COMMAND VALIDATOR ─────────────────────────
public sealed class ResetPasswordCommandValidator
: AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Reset token is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.NewPassword)
            .WithMessage("Passwords do not match.");
    }
}
public sealed class ResetPasswordCommandHandler(
    IAppDbContext db)
    : IRequestHandler<ResetPasswordCommand>
{
    public async Task Handle(ResetPasswordCommand req, CancellationToken ct)
    {
        var token = await db.OneTimeTokens
    .Include(x => x.User)
    .FirstOrDefaultAsync(
        x => x.Token == req.Token &&
             x.Purpose == OneTimeTokenPurpose.PasswordReset,
        ct);

        // Ensure the reset token exists.
        if (token is null)
            throw new InvalidOperationException(
    "The password reset token is invalid.");

        // Ensure the reset token has not expired.
        if (token.ExpiresAt <= DateTime.UtcNow)
            throw new InvalidOperationException(
                "The password reset token has expired.");

        // Ensure the reset token has not already been used.
        if (token.IsUsed)
            throw new InvalidOperationException(
                "The password reset token has already been used.");

        // Update the user's password with the newly hashed password.
        token.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);

        // Mark the reset token as used so it cannot be reused.
        token.IsUsed = true;
        token.UsedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}