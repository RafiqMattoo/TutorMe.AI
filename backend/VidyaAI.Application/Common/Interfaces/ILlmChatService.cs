public sealed record ChatTurn(string Role, string Content);

// LLM chat completion (RAG answers, generation tasks).
public interface ILlmChatService
{
    Task<string> CompleteAsync(string systemPrompt, IReadOnlyList<ChatTurn> turns, CancellationToken ct = default);

    // Streams the answer as it is generated (token/segment deltas), for a live
    // ChatGPT-style typing effect. Providers without true streaming may emit the
    // whole answer as a single delta.
    IAsyncEnumerable<string> CompleteStreamAsync(string systemPrompt, IReadOnlyList<ChatTurn> turns, CancellationToken ct = default);

    // Returns raw JSON string the model produced when asked to emit JSON.
    Task<string> CompleteJsonAsync(string systemPrompt, string userPrompt, CancellationToken ct = default);
}