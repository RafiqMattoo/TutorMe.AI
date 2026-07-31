using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

public sealed class TotpSecret : BaseEntity
{
    // User who owns this TOTP secret.
    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    // Base32 secret shared with the authenticator application.
    public string Secret { get; set; } = string.Empty;

    // Indicates whether two-factor authentication is enabled.
    public bool IsEnabled { get; set; } = false;


}