using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// REST client for Google Gemini.
//   Embeddings: text-embedding-004  (768 dims, free tier)
//   Chat:       gemini-2.0-flash    (free tier)
public sealed class GeminiService(HttpClient http, IConfiguration cfg, ILogger<GeminiService> log)
    : IEmbeddingService, ILlmChatService
{
    private readonly string _apiKey = cfg["Gemini:ApiKey"]
        ?? throw new InvalidOperationException("Gemini:ApiKey missing in configuration.");
    private readonly string _embeddingModel = cfg["Gemini:EmbeddingModel"] ?? "gemini-embedding-001";
    private readonly string _chatModel = cfg["Gemini:ChatModel"] ?? "gemini-2.5-flash";
    private readonly int _embeddingDims = int.TryParse(cfg["Gemini:EmbeddingDimensions"], out var d) ? d : 768;
    private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta";

    public int Dimensions => _embeddingDims;

    public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
    {
        var req = new
        {
            model = $"models/{_embeddingModel}",
            content = new { parts = new[] { new { text } } },
            taskType = "RETRIEVAL_DOCUMENT",
            outputDimensionality = _embeddingDims
        };
        var url = $"{BaseUrl}/models/{_embeddingModel}:embedContent?key={_apiKey}";
        var payload = await PostWithRetryAsync<EmbeddingResponse>(url, req, "embed", ct)
            ?? throw new InvalidOperationException("Empty Gemini embedding response.");
        return payload.Embedding?.Values ?? Array.Empty<float>();
    }

    public async Task<IReadOnlyList<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts, CancellationToken ct = default)
    {
        if (texts.Count == 0) return Array.Empty<float[]>();
        var req = new
        {
            requests = texts.Select(t => new
            {
                model = $"models/{_embeddingModel}",
                content = new { parts = new[] { new { text = t } } },
                taskType = "RETRIEVAL_DOCUMENT",
                outputDimensionality = _embeddingDims
            }).ToArray()
        };
        var url = $"{BaseUrl}/models/{_embeddingModel}:batchEmbedContents?key={_apiKey}";
        var payload = await PostWithRetryAsync<BatchEmbeddingResponse>(url, req, "batch embed", ct)
            ?? throw new InvalidOperationException("Empty Gemini batch embedding response.");
        return payload.Embeddings?.Select(e => e.Values ?? Array.Empty<float>()).ToList()
            ?? new List<float[]>();
    }

    // Sends the request and retries on 429/503 with exponential backoff.
    // Honors the Retry-After header when present. Throws GeminiApiException with
    // the parsed Gemini error so callers can show meaningful messages.
    private async Task<T?> PostWithRetryAsync<T>(string url, object body, string label, CancellationToken ct)
        where T : class
    {
        const int maxAttempts = 6;
        var delaySeconds = 4;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            using var res = await http.PostAsJsonAsync(url, body, JsonOpts, ct);
            if (res.IsSuccessStatusCode)
                return await res.Content.ReadFromJsonAsync<T>(JsonOpts, ct);

            var transient = (int)res.StatusCode == 429 || (int)res.StatusCode == 503;
            var responseBody = await res.Content.ReadAsStringAsync(ct);

            if (!transient || attempt == maxAttempts)
            {
                log.LogError("Gemini {Label} failed (attempt {Attempt}): {Status} {Body}",
                    label, attempt, res.StatusCode, responseBody);
                throw new LlmApiException((int)res.StatusCode, ExtractGeminiMessage(responseBody), responseBody);
            }

            var retryAfter = res.Headers.RetryAfter?.Delta?.TotalSeconds;
            var wait = retryAfter.HasValue ? (int)Math.Max(1, retryAfter.Value) : delaySeconds;
            log.LogWarning("Gemini {Label} 429/503 (attempt {Attempt}/{Max}); retrying in {Wait}s",
                label, attempt, maxAttempts, wait);
            await Task.Delay(TimeSpan.FromSeconds(wait), ct);
            delaySeconds = Math.Min(60, delaySeconds * 2);
        }
        return null;
    }

    private static string ExtractGeminiMessage(string body)
    {
        try
        {
            using var doc = JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("error", out var err) &&
                err.TryGetProperty("message", out var msg))
                return msg.GetString() ?? body;
        }
        catch { /* not JSON */ }
        return body.Length > 500 ? body[..500] : body;
    }

    public async Task<string> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> turns, CancellationToken ct = default)
    {
        var contents = turns.Select(t => new
        {
            role = t.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "model" : "user",
            parts = new[] { new { text = t.Content } }
        }).ToArray();

        var req = new
        {
            systemInstruction = new { parts = new[] { new { text = systemPrompt } } },
            contents,
            generationConfig = new { temperature = 0.4, maxOutputTokens = 2048 }
        };
        return await CallGenerateAsync(req, ct);
    }

    public async IAsyncEnumerable<string> CompleteStreamAsync(
        string systemPrompt, IReadOnlyList<ChatTurn> turns, [EnumeratorCancellation] CancellationToken ct = default)
    {
        // Gemini is the fallback provider; emit the full answer as a single delta.
        var full = await CompleteAsync(systemPrompt, turns, ct);
        yield return full;
    }

    public async Task<string> CompleteJsonAsync(string systemPrompt, string userPrompt, CancellationToken ct = default)
    {
        var req = new
        {
            systemInstruction = new { parts = new[] { new { text = systemPrompt } } },
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = userPrompt } } }
            },
            generationConfig = new
            {
                temperature = 0.6,
                maxOutputTokens = 8192,
                responseMimeType = "application/json"
            }
        };
        return await CallGenerateAsync(req, ct);
    }

    private async Task<string> CallGenerateAsync(object req, CancellationToken ct)
    {
        var url = $"{BaseUrl}/models/{_chatModel}:generateContent?key={_apiKey}";
        var payload = await PostWithRetryAsync<GenerateResponse>(url, req, "chat", ct)
            ?? throw new InvalidOperationException("Empty Gemini chat response.");

        return payload.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text
            ?? string.Empty;
    }

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private sealed record EmbeddingResponse([property: JsonPropertyName("embedding")] EmbeddingValues? Embedding);
    private sealed record BatchEmbeddingResponse([property: JsonPropertyName("embeddings")] List<EmbeddingValues>? Embeddings);
    private sealed record EmbeddingValues([property: JsonPropertyName("values")] float[]? Values);

    private sealed record GenerateResponse([property: JsonPropertyName("candidates")] List<Candidate>? Candidates);
    private sealed record Candidate([property: JsonPropertyName("content")] CandidateContent? Content);
    private sealed record CandidateContent([property: JsonPropertyName("parts")] List<CandidatePart>? Parts);
    private sealed record CandidatePart([property: JsonPropertyName("text")] string? Text);
}
