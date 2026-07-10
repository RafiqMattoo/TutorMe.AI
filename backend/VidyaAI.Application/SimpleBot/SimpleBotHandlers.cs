using MediatR;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;

namespace VidyaAI.Application.SimpleBot.Commands;

public record AskSimpleBotCommand(string Message, IReadOnlyList<SimpleBotTurnDto>? History)
    : IRequest<SimpleBotResponse>;

public sealed class AskSimpleBotCommandHandler(
    ILlmChatService llm,
    ILogger<AskSimpleBotCommandHandler> log)
    : IRequestHandler<AskSimpleBotCommand, SimpleBotResponse>
{
    private const int MaxHistoryTurns = 12;

    private const string SystemPrompt =
        """
        You are VidyaAI Simple Bot, a friendly study assistant for students and teachers.

        Keep responses clear, practical, and concise. Use short paragraphs and bullets
        when they help. If the user asks for help learning something, explain it step by
        step. If you are unsure, say so instead of guessing.
        """;

    public async Task<SimpleBotResponse> Handle(AskSimpleBotCommand cmd, CancellationToken ct)
    {
        var message = (cmd.Message ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(message))
            throw new ArgumentException("Message is required.");

        var turns = (cmd.History ?? Array.Empty<SimpleBotTurnDto>())
            .Where(t => !string.IsNullOrWhiteSpace(t.Content))
            .TakeLast(MaxHistoryTurns)
            .Select(t => new ChatTurn(
                string.Equals(t.Role, "assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user",
                t.Content.Trim()))
            .ToList();

        turns.Add(new ChatTurn("user", message));

        try
        {
            var reply = await llm.CompleteAsync(SystemPrompt, turns, ct);
            return new SimpleBotResponse(string.IsNullOrWhiteSpace(reply)
                ? "I could not produce a response. Please try again."
                : reply.Trim());
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Simple bot completion failed");
            return new SimpleBotResponse(DescribeLlmFailure(ex));
        }
    }

    private static string DescribeLlmFailure(Exception ex)
    {
        var status = (ex as LlmApiException)?.StatusCode ?? 0;
        return status switch
        {
            503 => "I can't reach the local AI. Make sure Ollama is running with `ollama serve`, then try again.",
            404 or 400 => "The configured AI model is not available. Check `Ollama:ChatModel` in `appsettings.json` and pull the model in Ollama.",
            429 => "The AI is busy right now. Please try again in a few seconds.",
            _ => $"Sorry, the bot failed to respond. {ex.Message}"
        };
    }
}
