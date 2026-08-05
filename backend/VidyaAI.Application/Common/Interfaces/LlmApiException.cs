// Thrown by LLM/embedding services when the upstream API returns a non-success
// response. Carries the HTTP status code so handlers can surface useful messages.
public sealed class LlmApiException(int statusCode, string message, string rawBody)
    : Exception(message)
{
    public int StatusCode { get; } = statusCode;
    public string RawBody { get; } = rawBody;
}