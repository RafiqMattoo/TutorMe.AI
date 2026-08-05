using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

// Tracks GDPR/data export requests submitted by users.
public class DataExportRequest : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    // Pending, Processing, Completed, Failed
    public string Status { get; set; } = "Pending";

    // Location of generated export file.
    public string? FileUrl { get; set; }

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }
}