// ── TEXT-TO-SPEECH (audio narration) ──────────────────────────────

// One unit of text to narrate. ChunkIndex/PageNumber are carried through so the
// resulting timing can be mapped back to the document for read-along highlighting.
public sealed record TtsSegment(int Index, int ChunkIndex, int? PageNumber, string Text);

// A narrated segment with its exact [StartMs, EndMs) offset in the stitched audio.
public sealed record TtsTiming(int Index, int ChunkIndex, int? PageNumber, string Text, int StartMs, int EndMs);

// The complete synthesis result: one audio blob plus the per-segment timeline.
public sealed record TtsResult(
    byte[] Audio, string ContentType, string FileExtension, int DurationMs,
    IReadOnlyList<TtsTiming> Timings);

public sealed record TtsVoice(string Id, string Name, string Language);

// Turns text into a single audio file with a precise per-segment timeline, so the
// frontend can highlight text in sync with playback. Implementations are pluggable
// (Tts:Provider) — the default is local macOS `say`.
public interface ITtsService
{
    // Lists voices the engine offers (for a voice picker).
    IReadOnlyList<TtsVoice> GetVoices();

    // Synthesizes all segments and stitches them into one audio file, returning the
    // bytes plus each segment's measured start/end offset.
    Task<TtsResult> SynthesizeAsync(IReadOnlyList<TtsSegment> segments, string? voiceId, CancellationToken ct = default);
}
