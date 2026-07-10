using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Text-to-image via Google Gemini's image model (default gemini-2.5-flash-image).
// Returns the first inline image part from a generateContent response. Used to
// illustrate each narration segment for the animated story-scenes view.
public sealed class GeminiImageService(HttpClient http, IConfiguration cfg, ILogger<GeminiImageService> log)
    : IImageGenerationService
{
    private readonly string? _apiKey = cfg["Gemini:ApiKey"];
    private readonly string _imageModel = cfg["Gemini:ImageModel"] ?? "gemini-2.5-flash-image";
    private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta";

    public bool Enabled => !string.IsNullOrWhiteSpace(_apiKey);

    public async Task<GeneratedImage?> GenerateAsync(string prompt, CancellationToken ct = default)
    {
        if (!Enabled) return null;

        var req = new
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = prompt } } }
            },
            // Image models must be told to emit an image modality.
            generationConfig = new { responseModalities = new[] { "TEXT", "IMAGE" } }
        };

        var url = $"{BaseUrl}/models/{_imageModel}:generateContent?key={_apiKey}";
        var payload = await PostWithRetryAsync(url, req, ct);
        if (payload is null) return null;

        var inline = payload.Candidates?
            .SelectMany(c => c.Content?.Parts ?? new List<ImagePart>())
            .Select(p => p.InlineData)
            .FirstOrDefault(d => d is not null && !string.IsNullOrEmpty(d.Data));

        if (inline?.Data is null)
        {
            log.LogWarning("Gemini image response contained no image data.");
            return null;
        }

        byte[] bytes;
        try { bytes = Convert.FromBase64String(inline.Data); }
        catch (FormatException ex) { log.LogWarning(ex, "Gemini returned malformed base64 image."); return null; }

        var mime = string.IsNullOrWhiteSpace(inline.MimeType) ? "image/png" : inline.MimeType;
        var ext = mime.Contains("jpeg") || mime.Contains("jpg") ? ".jpg"
            : mime.Contains("webp") ? ".webp" : ".png";
        return new GeneratedImage(bytes, mime, ext);
    }

    // Posts and retries on 429/503 with exponential backoff, honoring Retry-After.
    // Returns null on persistent failure so callers can fall back to a text-only slide.
    private async Task<GenerateResponse?> PostWithRetryAsync(string url, object body, CancellationToken ct)
    {
        const int maxAttempts = 4;
        var delaySeconds = 4;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            using var res = await http.PostAsJsonAsync(url, body, JsonOpts, ct);
            if (res.IsSuccessStatusCode)
                return await res.Content.ReadFromJsonAsync<GenerateResponse>(JsonOpts, ct);

            var transient = (int)res.StatusCode is 429 or 503;
            var responseBody = await res.Content.ReadAsStringAsync(ct);

            if (!transient || attempt == maxAttempts)
            {
                log.LogWarning("Gemini image gen failed (attempt {Attempt}): {Status} {Body}",
                    attempt, res.StatusCode, responseBody.Length > 400 ? responseBody[..400] : responseBody);
                return null;
            }

            var retryAfter = res.Headers.RetryAfter?.Delta?.TotalSeconds;
            var wait = retryAfter.HasValue ? (int)Math.Max(1, retryAfter.Value) : delaySeconds;
            log.LogWarning("Gemini image gen 429/503 (attempt {Attempt}/{Max}); retrying in {Wait}s",
                attempt, maxAttempts, wait);
            await Task.Delay(TimeSpan.FromSeconds(wait), ct);
            delaySeconds = Math.Min(60, delaySeconds * 2);
        }
        return null;
    }

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private sealed record GenerateResponse([property: JsonPropertyName("candidates")] List<ImageCandidate>? Candidates);
    private sealed record ImageCandidate([property: JsonPropertyName("content")] ImageContent? Content);
    private sealed record ImageContent([property: JsonPropertyName("parts")] List<ImagePart>? Parts);
    private sealed record ImagePart([property: JsonPropertyName("inlineData")] InlineData? InlineData);
    private sealed record InlineData(
        [property: JsonPropertyName("mimeType")] string? MimeType,
        [property: JsonPropertyName("data")] string? Data);
}
