using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

public enum OneTimeTokenPurpose
{
    EmailVerification = 1,
    PasswordReset = 2
}

public sealed class OneTimeToken : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    public string Token { get; set; } = string.Empty;

    public OneTimeTokenPurpose Purpose { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    public bool IsUsed { get; set; } = false;
}