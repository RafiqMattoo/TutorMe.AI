using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── MATERIAL ──────────────────────────────────────────────────────
public class Material : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = "application/pdf";
    public long FileSize { get; set; }
    public int PageCount { get; set; }
    public MaterialStatus Status { get; set; } = MaterialStatus.Processing;
    public string? ErrorMessage { get; set; }

    public Guid UploadedById { get; set; }
    public User UploadedBy { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public ICollection<MaterialChunk> Chunks { get; set; } = [];
    public ICollection<ChatSession> ChatSessions { get; set; } = [];
}

// ── MATERIAL CHUNK (vector) ───────────────────────────────────────
public class MaterialChunk : BaseEntity
{
    public Guid MaterialId { get; set; }
    public Material Material { get; set; } = null!;

    public int ChunkIndex { get; set; }
    public int? PageNumber { get; set; }
    public string Content { get; set; } = string.Empty;
    public int TokenCount { get; set; }

    // 768 dims for Gemini text-embedding-004; stored as Postgres real[]
    public float[]? Embedding { get; set; }
}

// ── CHAT SESSION ──────────────────────────────────────────────────
public class ChatSession : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? MaterialId { get; set; }
    public Material? Material { get; set; }

    public ICollection<ChatMessage> Messages { get; set; } = [];
}

// ── CHAT MESSAGE ──────────────────────────────────────────────────
public class ChatMessage : BaseEntity
{
    public Guid SessionId { get; set; }
    public ChatSession Session { get; set; } = null!;

    public ChatRole Role { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? CitedChunkIds { get; set; }   // CSV of MaterialChunk Ids used as context
}
