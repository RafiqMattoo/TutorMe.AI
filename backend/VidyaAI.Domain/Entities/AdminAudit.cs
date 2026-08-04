using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

// Records administrative actions performed in the system.
public class AdminAudit : BaseEntity
{
    public Guid AdminUserId { get; set; }

    public User AdminUser { get; set; } = null!;

    public string Action { get; set; } = string.Empty;

    public string? EntityType { get; set; }

    public Guid? EntityId { get; set; }

    public string? Details { get; set; }

    public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
}