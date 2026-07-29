using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

// Backup codes used when a user cannot access their authenticator app.
public class RecoveryCode : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Code { get; set; } = string.Empty;

    public bool IsUsed { get; set; }

    public DateTime? UsedAt { get; set; }
}