using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// REST client for a local Ollama server (http://localhost:11434).
//   Embeddings: nomic-embed-text  (768 dims by default)  -> POST /api/embed
//   Chat:       llama3.2                                  -> POST /api/chat
//
// Fully local & private: book text never leaves the machine. Selected when
// AI:Provider = "ollama". Implements the same interfaces as GeminiService so it
// is a drop-in replacement for the RAG / generation pipeline.
public sealed class OllamaAiService(HttpClient http, IConfiguration cfg, ILogger<OllamaAiService> log)
    : IEmbeddingService, ILlmChatService
{
    private readonly string _baseUrl = (cfg["Ollama:BaseUrl"] ?? "http://localhost:11434").TrimEnd('/');
    private readonly string _embeddingModel = cfg["Ollama:EmbeddingModel"] ?? "nomic-embed-text";
    private readonly string _chatModel = cfg["Ollama:ChatModel"] ?? "llama3.2";
    // Quiz/flashcard/lesson JSON generation needs strong instruction-following
    // (return an array of N items). Allow a separate, more capable model than the
    // chat model — falls back to the chat model if not configured.
    private readonly string _generationModel = cfg["Ollama:GenerationModel"] ?? cfg["Ollama:ChatModel"] ?? "llama3.2";
    private readonly int _embeddingDims = int.TryParse(cfg["Ollama:EmbeddingDimensions"], out var d) ? d : 768;
    private readonly double _temperature = double.TryParse(cfg["Ollama:Temperature"], out var t) ? t : 0.4;
    private readonly int _maxTokens = int.TryParse(cfg["Ollama:MaxTokens"], out var m) ? m : 2048;

    public int Dimensions => _embeddingDims;

    public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
    {
        var result = await EmbedBatchAsync(new[] { text }, ct);
        return result.Count > 0 ? result[0] : Array.Empty<float>();
    }

    public async Task<IReadOnlyList<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts, CancellationToken ct = default)
    {
        if (texts.Count == 0) return Array.Empty<float[]>();

        // Ollama's /api/embed accepts a single string or an array of strings via "input".
        var req = new { model = _embeddingModel, input = texts };
        var url = $"{_baseUrl}/api/embed";
        var payload = await PostWithRetryAsync<EmbedResponse>(url, req, "embed", ct)
            ?? throw new InvalidOperationException("Empty Ollama embedding response.");

        if (payload.Embeddings is null || payload.Embeddings.Count == 0)
            throw new InvalidOperationException(
                $"Ollama returned no embeddings for model '{_embeddingModel}'. Is it pulled? (ollama pull {_embeddingModel})");

        return payload.Embeddings.Select(e => e ?? Array.Empty<float>()).ToList();
    }

    public async Task<string> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> turns, CancellationToken ct = default)
    {
        var messages = new List<OllamaMessage> { new("system", systemPrompt) };
        messages.AddRange(turns.Select(t => new OllamaMessage(
            t.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user",
            t.Content)));

        var req = new
        {
            model = _chatModel,
            messages,
            stream = false,
            // keep_alive holds the model in RAM between requests so we don't pay the
            // multi-second cold-load on every question (important on CPU-only hosts).
            keep_alive = "30m",
            options = new { temperature = _temperature, num_predict = _maxTokens }
        };
        return await CallChatAsync(req, "chat", ct);
    }

    public async IAsyncEnumerable<string> CompleteStreamAsync(
        string systemPrompt, IReadOnlyList<ChatTurn> turns, [EnumeratorCancellation] CancellationToken ct = default)
    {
        var messages = new List<OllamaMessage> { new("system", systemPrompt) };
        messages.AddRange(turns.Select(t => new OllamaMessage(
            t.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user",
            t.Content)));

        var req = new
        {
            model = _chatModel,
            messages,
            stream = true,
            keep_alive = "30m",
            options = new { temperature = _temperature, num_predict = _maxTokens }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/api/chat")
        {
            Content = JsonContent.Create(req, options: JsonOpts)
        };
        // ResponseHeadersRead lets us read the body as it streams rather than buffering.
        using var res = await http.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
        if (!res.IsSuccessStatusCode)
        {
            var body = await res.Content.ReadAsStringAsync(ct);
            log.LogError("Ollama stream failed: {Status} {Body}", res.StatusCode, body);
            throw new LlmApiException((int)res.StatusCode, ExtractOllamaMessage(body), body);
        }

        // Ollama streams newline-delimited JSON, one object per generated segment.
        await using var stream = await res.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream);
        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync(ct);
            if (string.IsNullOrWhiteSpace(line)) continue;

            ChatResponse? chunk;
            try { chunk = JsonSerializer.Deserialize<ChatResponse>(line, JsonOpts); }
            catch { continue; } // skip a malformed line rather than aborting the stream

            var delta = chunk?.Message?.Content;
            if (!string.IsNullOrEmpty(delta)) yield return delta;
            if (chunk?.Done == true) yield break;
        }
    }

    public async Task<string> CompleteJsonAsync(string systemPrompt, string userPrompt, CancellationToken ct = default)
    {
        var messages = new List<OllamaMessage>
        {
            new("system", systemPrompt),
            new("user", userPrompt)
        };

        // format: "json" forces Ollama to emit syntactically valid JSON.
        var req = new
        {
            model = _generationModel,
            messages,
            stream = false,
            format = "json",
            keep_alive = "30m",
            options = new { temperature = Math.Min(_temperature + 0.2, 1.0), num_predict = 4096 }
        };
        return await CallChatAsync(req, "chat-json", ct);
    }

    private async Task<string> CallChatAsync(object req, string label, CancellationToken ct)
    {
        var url = $"{_baseUrl}/api/chat";
        var payload = await PostWithRetryAsync<ChatResponse>(url, req, label, ct)
            ?? throw new InvalidOperationException("Empty Ollama chat response.");
        return payload.Message?.Content ?? string.Empty;
    }

    // Posts the request and retries on transient failures (connection refused,
    // 503 while the model loads). Throws LlmApiException on a definitive
    // non-success so handlers can surface a meaningful message — same contract
    // as GeminiService.
    private async Task<T?> PostWithRetryAsync<T>(string url, object body, string label, CancellationToken ct)
        where T : class
    {
        const int maxAttempts = 4;
        var delaySeconds = 3;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                using var res = await http.PostAsJsonAsync(url, body, JsonOpts, ct);
                if (res.IsSuccessStatusCode)
                    return await res.Content.ReadFromJsonAsync<T>(JsonOpts, ct);

                var responseBody = await res.Content.ReadAsStringAsync(ct);
                var transient = (int)res.StatusCode == 503;

                if (!transient || attempt == maxAttempts)
                {
                    log.LogError("Ollama {Label} failed (attempt {Attempt}): {Status} {Body}",
                        label, attempt, res.StatusCode, responseBody);
                    throw new LlmApiException((int)res.StatusCode, ExtractOllamaMessage(responseBody), responseBody);
                }

                log.LogWarning("Ollama {Label} 503 (attempt {Attempt}/{Max}); model may be loading, retrying in {Wait}s",
                    label, attempt, maxAttempts, delaySeconds);
            }
            catch (HttpRequestException ex) when (attempt < maxAttempts)
            {
                // Connection refused / server not up yet — retry a few times.
                log.LogWarning("Ollama {Label} connection error (attempt {Attempt}/{Max}): {Message}; retrying in {Wait}s",
                    label, attempt, maxAttempts, ex.Message, delaySeconds);
            }
            catch (HttpRequestException ex)
            {
                log.LogError(ex, "Ollama {Label} unreachable at {Url} after {Max} attempts.", label, url, maxAttempts);
                throw new LlmApiException(503,
                    $"Cannot reach Ollama at {_baseUrl}. Is it running? (ollama serve)", ex.Message);
            }

            await Task.Delay(TimeSpan.FromSeconds(delaySeconds), ct);
            delaySeconds = Math.Min(30, delaySeconds * 2);
        }
        return null;
    }

    private static string ExtractOllamaMessage(string body)
    {
        try
        {
            using var doc = JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("error", out var err))
                return err.GetString() ?? body;
        }
        catch { /* not JSON */ }
        return body.Length > 500 ? body[..500] : body;
    }

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private sealed record OllamaMessage(
        [property: JsonPropertyName("role")] string Role,
        [property: JsonPropertyName("content")] string Content);

    private sealed record EmbedResponse([property: JsonPropertyName("embeddings")] List<float[]?>? Embeddings);

    private sealed record ChatResponse(
        [property: JsonPropertyName("message")] ChatResponseMessage? Message,
        [property: JsonPropertyName("done")] bool Done);
    private sealed record ChatResponseMessage([property: JsonPropertyName("content")] string? Content);
}
