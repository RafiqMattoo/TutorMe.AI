using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── NARRATION ─────────────────────────────────────────────────────
// A generated audio narration for a Material. The audio is a single file
// (one WAV stitched from per-chunk clips) served from storage, plus a timeline
// of Segments so the frontend can highlight text in sync with playback.
public class Narration : BaseEntity
{
    public Guid MaterialId { get; set; }
    public Material Material { get; set; } = null!;

    // Verbatim narration (Recite) vs an AI-simplified explainer. One of each per material.
    public NarrationKind Kind { get; set; } = NarrationKind.Verbatim;

    public NarrationStatus Status { get; set; } = NarrationStatus.Processing;

    // URL of the stitched audio file (e.g. /files/uploads/2026/06/{guid}-narration.wav).
    public string? AudioUrl { get; set; }
    public string ContentType { get; set; } = "audio/wav";

    // TTS voice id used (engine-specific, e.g. macOS "Samantha"); null = engine default.
    public string? Voice { get; set; }
    public int DurationMs { get; set; }
    public string? ErrorMessage { get; set; }

    public ICollection<NarrationSegment> Segments { get; set; } = [];
}

// ── NARRATION SEGMENT (timeline) ──────────────────────────────────
// One contiguous unit of audio (currently one per MaterialChunk) with its exact
// [StartMs, EndMs) offset inside the stitched file. The frontend highlights the
// active segment and interpolates word position within it.
public class NarrationSegment : BaseEntity
{
    public Guid NarrationId { get; set; }
    public Narration Narration { get; set; } = null!;

    public int SegmentIndex { get; set; }
    public int ChunkIndex { get; set; }      // source MaterialChunk.ChunkIndex
    public int? PageNumber { get; set; }
    public string Text { get; set; } = string.Empty;

    public int StartMs { get; set; }
    public int EndMs { get; set; }

    // URL of the AI-generated illustration for this segment (Illustrated kind only;
    // null for Verbatim/Explained or when image generation was unavailable/failed).
    public string? ImageUrl { get; set; }
}
