using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;

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
            .FirstOrDefaultAsync(u => u.Email == req.Email && u.IsActive && !u.IsDeleted, ct)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Role.ToString(), user.SchoolId);
        var refreshToken = jwt.GenerateRefreshToken();
        var refreshDays = int.Parse(config["Jwt:RefreshExpiryDays"] ?? "7");

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshDays);
        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return new LoginResponse(accessToken, refreshToken, MapUser(user));
    }

    private static UserDto MapUser(User u) => new(
        u.Id, u.FirstName, u.LastName, u.Email, u.Phone, u.AvatarUrl,
        u.Role, u.IsActive, u.EmailVerified, u.LastLoginAt,
        u.SchoolId, u.School?.Name, u.CreatedAt);
}

// ── REFRESH TOKEN COMMAND ─────────────────────────────────────────
public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponse>;

public sealed class RefreshTokenCommandHandler(
    IAppDbContext db, IJwtService jwt)
    : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(RefreshTokenCommand req, CancellationToken ct)
    {
        var user = await db.Users
            .Include(u => u.School)
            .FirstOrDefaultAsync(u => u.RefreshToken == req.RefreshToken
                && u.RefreshTokenExpiry > DateTime.UtcNow && !u.IsDeleted, ct)
            ?? throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Role.ToString(), user.SchoolId);
        var newRefresh = jwt.GenerateRefreshToken();
        user.RefreshToken = newRefresh;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await db.SaveChangesAsync(ct);

        return new LoginResponse(accessToken, newRefresh, new UserDto(
            user.Id, user.FirstName, user.LastName, user.Email, user.Phone, user.AvatarUrl,
            user.Role, user.IsActive, user.EmailVerified, user.LastLoginAt,
            user.SchoolId, user.School?.Name, user.CreatedAt));
    }
}

// ── LOGOUT COMMAND ────────────────────────────────────────────────
public record LogoutCommand(Guid UserId) : IRequest;

public sealed class LogoutCommandHandler(IAppDbContext db) : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand req, CancellationToken ct)
    {
        var user = await db.Users.FindAsync([req.UserId], ct);
        if (user is null) return;
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await db.SaveChangesAsync(ct);
    }
}
