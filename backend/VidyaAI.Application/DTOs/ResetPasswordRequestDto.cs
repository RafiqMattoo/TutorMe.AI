namespace VidyaAI.Application.DTOs;

// Request payload for resetting a user's password using a valid one-time reset token.
public sealed record ResetPasswordRequestDto(
    string Token,
    string NewPassword,
    string ConfirmPassword);