// ── AI IMAGE GENERATION (illustrated story scenes) ────────────────

// A single generated image: raw bytes plus how to store/serve it.
public sealed record GeneratedImage(byte[] Data, string ContentType, string FileExtension);

// Turns a text prompt into one illustration, used to give each narration segment a
// picture for the animated story-scenes view. Image models aren't available locally,
// so this is cloud-backed; Enabled is false when no API key is configured and the
// caller should fall back to a text-only slide.
public interface IImageGenerationService
{
    bool Enabled { get; }

    // Generates an image for the prompt, or null if the model returned no image
    // (callers degrade gracefully rather than failing the whole narration).
    Task<GeneratedImage?> GenerateAsync(string prompt, CancellationToken ct = default);
}
