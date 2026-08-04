using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

// Records user authentication activity.
public class LoginAudit : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Email { get; set; } = string.Empty;

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public bool IsSuccessful { get; set; }

    public string? FailureReason { get; set; }

    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
}