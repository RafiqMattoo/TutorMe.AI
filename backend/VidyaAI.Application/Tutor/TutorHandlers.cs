using System.Runtime.CompilerServices;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Tutor.Queries
{
    public record GetChatSessionsQuery(Guid UserId) : IRequest<IReadOnlyList<ChatSessionDto>>;

    public sealed class GetChatSessionsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetChatSessionsQuery, IReadOnlyList<ChatSessionDto>>
    {
        public async Task<IReadOnlyList<ChatSessionDto>> Handle(GetChatSessionsQuery q, CancellationToken ct) =>
            await db.ChatSessions.AsNoTracking()
                .Where(s => s.UserId == q.UserId)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new ChatSessionDto(
                    s.Id, s.Title, s.MaterialId, s.Material != null ? s.Material.Title : null,
                    s.Messages.Count, s.CreatedAt))
                .ToListAsync(ct);
    }

    public record GetChatMessagesQuery(Guid SessionId, Guid UserId) : IRequest<IReadOnlyList<ChatMessageDto>>;

    public sealed class GetChatMessagesQueryHandler(IAppDbContext db)
        : IRequestHandler<GetChatMessagesQuery, IReadOnlyList<ChatMessageDto>>
    {
        public async Task<IReadOnlyList<ChatMessageDto>> Handle(GetChatMessagesQuery q, CancellationToken ct)
        {
            var session = await db.ChatSessions.AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == q.SessionId && s.UserId == q.UserId, ct)
                ?? throw new KeyNotFoundException("Session not found.");

            var messages = await db.ChatMessages.AsNoTracking()
                .Where(m => m.SessionId == session.Id)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync(ct);

            return messages
                .Select(m => new ChatMessageDto(m.Id, m.Role, m.Content,
                    Array.Empty<ChunkCitationDto>(), m.CreatedAt))
                .ToList();
        }
    }
}

namespace VidyaAI.Application.Tutor.Commands
{
    public record AskTutorCommand(Guid? SessionId, Guid? MaterialId, string Question, Guid UserId)
        : IRequest<AskTutorResponse>;

    public sealed class AskTutorCommandHandler(
        IAppDbContext db,
        IEmbeddingService embeddings,
        ILlmChatService llm,
        ILogger<AskTutorCommandHandler> log)
        : IRequestHandler<AskTutorCommand, AskTutorResponse>
    {
        public async Task<AskTutorResponse> Handle(AskTutorCommand cmd, CancellationToken ct)
        {
            var (session, userMsg) = await TutorRag.StartTurnAsync(db, cmd.SessionId, cmd.MaterialId, cmd.UserId, cmd.Question, ct);

            var materialId = session.MaterialId ?? cmd.MaterialId;
            var (contextBlock, citations, lexicalFallback) = materialId.HasValue
                ? await TutorRag.RetrieveAsync(db, embeddings, log, materialId.Value, cmd.Question, ct)
                : (string.Empty, new List<ChunkCitationDto>(), false);

            string answer;
            var chatFailed = false;
            if (string.IsNullOrEmpty(contextBlock))
            {
                answer = TutorRag.NoContextMessage;
                citations.Clear();
            }
            else
            {
                var history = await TutorRag.BuildHistoryAsync(db, session.Id, userMsg.Id, cmd.Question, contextBlock, ct);
                try
                {
                    answer = await llm.CompleteAsync(TutorRag.BuildSystemPrompt(), history, ct);
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "Tutor chat completion failed");
                    answer = TutorRag.DescribeLlmFailure(ex);
                    chatFailed = true;
                    citations.Clear();
                }

                if (!chatFailed && string.IsNullOrWhiteSpace(answer))
                    answer = TutorRag.NoAnswerMessage;
                if (!chatFailed && lexicalFallback)
                    answer += TutorRag.LexicalFallbackNote;
            }

            var assistantMsg = await TutorRag.PersistAssistantAsync(db, session.Id, answer, citations, ct);
            return new AskTutorResponse(session.Id, new ChatMessageDto(
                assistantMsg.Id, assistantMsg.Role, assistantMsg.Content, citations, assistantMsg.CreatedAt));
        }
    }

    // Streamed (SSE) variant: emits the answer token-by-token for a live typing effect.
    public record AskTutorStreamCommand(Guid? SessionId, Guid? MaterialId, string Question, Guid UserId)
        : IStreamRequest<TutorStreamEvent>;

    public sealed class AskTutorStreamCommandHandler(
        IAppDbContext db,
        IEmbeddingService embeddings,
        ILlmChatService llm,
        ILogger<AskTutorStreamCommandHandler> log)
        : IStreamRequestHandler<AskTutorStreamCommand, TutorStreamEvent>
    {
        public async IAsyncEnumerable<TutorStreamEvent> Handle(
            AskTutorStreamCommand cmd, [EnumeratorCancellation] CancellationToken ct)
        {
            var (session, userMsg) = await TutorRag.StartTurnAsync(db, cmd.SessionId, cmd.MaterialId, cmd.UserId, cmd.Question, ct);

            var materialId = session.MaterialId ?? cmd.MaterialId;
            var (contextBlock, citations, lexicalFallback) = materialId.HasValue
                ? await TutorRag.RetrieveAsync(db, embeddings, log, materialId.Value, cmd.Question, ct)
                : (string.Empty, new List<ChunkCitationDto>(), false);

            // Tell the client which session this is up front (so it can update the URL).
            yield return new TutorStreamEvent("meta", session.Id, null, null, null);

            var sb = new StringBuilder();
            if (string.IsNullOrEmpty(contextBlock))
            {
                citations.Clear();
                sb.Append(TutorRag.NoContextMessage);
                yield return new TutorStreamEvent("token", null, TutorRag.NoContextMessage, null, null);
            }
            else
            {
                var history = await TutorRag.BuildHistoryAsync(db, session.Id, userMsg.Id, cmd.Question, contextBlock, ct);

                // yield can't live inside try/catch, so drive the enumerator manually:
                // capture each delta (or the error) inside try, emit it outside.
                await using var e = llm.CompleteStreamAsync(TutorRag.BuildSystemPrompt(), history, ct).GetAsyncEnumerator(ct);
                string? errorText = null;
                while (true)
                {
                    string? delta = null;
                    bool moved;
                    try
                    {
                        moved = await e.MoveNextAsync();
                        if (moved) delta = e.Current;
                    }
                    catch (Exception ex)
                    {
                        log.LogError(ex, "Tutor stream failed");
                        errorText = TutorRag.DescribeLlmFailure(ex);
                        break;
                    }
                    if (!moved) break;
                    if (string.IsNullOrEmpty(delta)) continue;
                    sb.Append(delta);
                    yield return new TutorStreamEvent("token", null, delta, null, null);
                }

                if (errorText is not null)
                {
                    citations.Clear();
                    sb.Append("\n\n").Append(errorText);
                    yield return new TutorStreamEvent("token", null, "\n\n" + errorText, null, null);
                }
                else if (sb.Length == 0)
                {
                    sb.Append(TutorRag.NoAnswerMessage);
                    yield return new TutorStreamEvent("token", null, TutorRag.NoAnswerMessage, null, null);
                }
                else if (lexicalFallback)
                {
                    sb.Append(TutorRag.LexicalFallbackNote);
                    yield return new TutorStreamEvent("token", null, TutorRag.LexicalFallbackNote, null, null);
                }
            }

            var assistantMsg = await TutorRag.PersistAssistantAsync(db, session.Id, sb.ToString(), citations, ct);
            yield return new TutorStreamEvent("done", session.Id, null, citations, assistantMsg.Id);
        }
    }

    // Shared RAG/grounding logic used by both the buffered and streamed handlers.
    internal static class TutorRag
    {
        public const int TopK = 5;
        public const int RecentTurns = 8;

        public const string NoContextMessage =
            "I answer **only from your study materials**, not from general knowledge.\n\n" +
            "Select a document from the left (or upload one on the Materials page), then ask " +
            "your question — I'll reply using that document and cite the sections I used.";
        public const string NoAnswerMessage =
            "I couldn't find an answer to that in the selected document. Try rephrasing your question.";
        public const string LexicalFallbackNote =
            "\n\n_(Note: semantic search was unavailable — used keyword matching to find the relevant sections.)_";

        // Resolves (or creates) the session and persists the user's question.
        public static async Task<(ChatSession Session, ChatMessage UserMsg)> StartTurnAsync(
            IAppDbContext db, Guid? sessionId, Guid? materialId, Guid userId, string question, CancellationToken ct)
        {
            ChatSession session;
            if (sessionId.HasValue)
            {
                session = await db.ChatSessions
                    .FirstOrDefaultAsync(s => s.Id == sessionId.Value && s.UserId == userId, ct)
                    ?? throw new KeyNotFoundException("Session not found.");
            }
            else
            {
                session = new ChatSession { UserId = userId, MaterialId = materialId, Title = Truncate(question, 80) };
                db.ChatSessions.Add(session);
                await db.SaveChangesAsync(ct);
            }

            var userMsg = new ChatMessage { SessionId = session.Id, Role = ChatRole.User, Content = question };
            db.ChatMessages.Add(userMsg);
            await db.SaveChangesAsync(ct);
            return (session, userMsg);
        }

        // Retrieves the most relevant chunks for the question so the model answers
        // FROM THE DOCUMENT. Strategy: vector similarity first; if that yields no
        // usable hits (chunks not embedded, embedding failed, or dimension mismatch
        // after a provider switch), fall back to keyword search over ALL chunks.
        // Only a document with zero chunks returns empty context. Excerpts are joined
        // plainly — no chunk/page labels — so the model can't echo them.
        public static async Task<(string Context, List<ChunkCitationDto> Citations, bool LexicalFallback)> RetrieveAsync(
            IAppDbContext db, IEmbeddingService embeddings, ILogger log,
            Guid materialId, string question, CancellationToken ct)
        {
            float[]? queryVec = null;
            try { queryVec = await embeddings.EmbedAsync(question, ct); }
            catch (Exception ex) { log.LogWarning(ex, "Question embedding failed; falling back to keyword search"); }

            // 1. Primary path — semantic (vector) similarity over embedded chunks.
            if (queryVec is { Length: > 0 })
            {
                var candidates = await db.MaterialChunks.AsNoTracking()
                    .Where(c => c.MaterialId == materialId && c.Embedding != null)
                    .Select(c => new { c.Id, c.PageNumber, c.Content, c.Embedding })
                    .ToListAsync(ct);

                var hits = candidates
                    .Select(c => new { c.Id, c.PageNumber, c.Content, Score = CosineSimilarity(queryVec, c.Embedding!) })
                    // Score == 0 means orthogonal or dimension mismatch (e.g. Gemini
                    // vectors queried with Ollama) — treat as "no semantic signal".
                    .Where(c => c.Score > 0f)
                    .OrderByDescending(c => c.Score)
                    .Take(TopK)
                    .ToList();

                if (hits.Count > 0)
                {
                    var citations = hits.Select(h => new ChunkCitationDto(h.Id, h.PageNumber, Truncate(h.Content, 200))).ToList();
                    var context = string.Join("\n\n---\n\n", hits.Select(h => h.Content));
                    return (context, citations, false);
                }

                log.LogWarning("No usable vector hits for material {MaterialId} — chunks may be unembedded or " +
                    "embedded by a different provider. Falling back to keyword search.", materialId);
            }

            // 2. Fallback — lexical keyword search over EVERY chunk of the material.
            var allChunks = await db.MaterialChunks.AsNoTracking()
                .Where(c => c.MaterialId == materialId)
                .Select(c => new { c.Id, c.PageNumber, c.Content })
                .ToListAsync(ct);

            if (allChunks.Count == 0)
                return (string.Empty, new List<ChunkCitationDto>(), false); // document not indexed yet

            var terms = TokenizeQuery(question);
            var ranked = allChunks
                .Select(c => new { c.Id, c.PageNumber, c.Content, Score = LexicalScore(terms, c.Content) })
                .OrderByDescending(c => c.Score)
                .ThenBy(c => c.Content.Length)
                .Take(TopK)
                .ToList();

            var lexCitations = ranked.Select(h => new ChunkCitationDto(h.Id, h.PageNumber, Truncate(h.Content, 200))).ToList();
            var lexContext = string.Join("\n\n---\n\n", ranked.Select(h => h.Content));
            return (lexContext, lexCitations, true);
        }

        // Builds the last few conversation turns plus the grounded user prompt.
        public static async Task<List<ChatTurn>> BuildHistoryAsync(
            IAppDbContext db, Guid sessionId, Guid excludeMessageId, string question, string contextBlock, CancellationToken ct)
        {
            var history = await db.ChatMessages.AsNoTracking()
                .Where(m => m.SessionId == sessionId && m.Id != excludeMessageId)
                .OrderByDescending(m => m.CreatedAt)
                .Take(RecentTurns)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new ChatTurn(m.Role.ToString().ToLowerInvariant(), m.Content))
                .ToListAsync(ct);

            history.Add(new ChatTurn("user", BuildUserPrompt(question, contextBlock)));
            return history;
        }

        public static async Task<ChatMessage> PersistAssistantAsync(
            IAppDbContext db, Guid sessionId, string content, List<ChunkCitationDto> citations, CancellationToken ct)
        {
            var msg = new ChatMessage
            {
                SessionId = sessionId,
                Role = ChatRole.Assistant,
                Content = content,
                CitedChunkIds = citations.Count == 0 ? null : string.Join(',', citations.Select(c => c.ChunkId))
            };
            db.ChatMessages.Add(msg);
            await db.SaveChangesAsync(ct);
            return msg;
        }

        public static string BuildSystemPrompt() =>
            """
            You are VidyaAI Tutor, a warm and helpful study assistant. The CONTEXT below
            contains excerpts from the document the student selected, and is your ONLY
            source of truth.

            Rules — follow strictly:
            • Answer USING ONLY the information in the CONTEXT. Do NOT use outside or
              prior knowledge.
            • Reply naturally and conversationally, the way a good tutor would speak.
              Do NOT mention "chunks", "sections", "context", "excerpts" or page numbers,
              and never write phrases like "According to Chunk 1" or "as per page 2" —
              just give the answer directly. (The student sees the sources separately.)
            • Format for easy reading with short paragraphs, **bold** for key terms, and
              bullet or numbered lists where they help.
            • If the CONTEXT does not contain the answer, reply exactly:
              "That isn't covered in the selected document." Do not answer from general
              knowledge.
            """;

        public static string BuildUserPrompt(string question, string context) =>
            string.IsNullOrEmpty(context)
                ? question
                : $"CONTEXT (your only source):\n{context}\n\n" +
                  $"QUESTION: {question}\n\n" +
                  "Answer directly and conversationally using only the CONTEXT above. " +
                  "Do not mention the context, chunks, or page numbers. If the answer " +
                  "isn't there, say \"That isn't covered in the selected document.\"";

        // Maps an LLM/transport failure to a helpful, provider-aware message.
        // The active provider is local Ollama (see appsettings AI:Provider).
        public static string DescribeLlmFailure(Exception ex)
        {
            var status = (ex as LlmApiException)?.StatusCode ?? 0;
            return status switch
            {
                503 => "**Can't reach the local AI.** Make sure Ollama is running (`ollama serve`), then ask again.",
                404 or 400 => "**The AI model isn't available.** Check `Ollama:ChatModel` in `appsettings.json` and that " +
                              $"the model is pulled (e.g. `ollama pull gemma3:4b`).\n\nDetails: _{ex.Message}_",
                429 => "**The AI is busy right now.** Wait a few seconds and ask again.",
                _ => $"Sorry — the AI tutor failed. {ex.Message}"
            };
        }

        public static string Truncate(string s, int max) =>
            s.Length <= max ? s : s[..max].TrimEnd() + "…";

        private static readonly HashSet<string> Stopwords = new(StringComparer.OrdinalIgnoreCase)
        {
            "a","an","the","is","are","was","were","be","been","being","of","in","on","for","to","and","or","but",
            "with","at","by","from","as","that","this","these","those","it","its","their","they","them","there",
            "what","which","who","whom","how","why","when","where","do","does","did","i","you","we","he","she","my",
            "your","our","not","no","yes","can","could","would","should","may","might","will","shall","about","into"
        };

        private static List<string> TokenizeQuery(string s) =>
            System.Text.RegularExpressions.Regex.Matches(s.ToLowerInvariant(), @"[a-z0-9]{2,}")
                .Select(m => m.Value)
                .Where(t => !Stopwords.Contains(t))
                .Distinct()
                .ToList();

        private static int LexicalScore(List<string> queryTerms, string chunk)
        {
            if (queryTerms.Count == 0) return 0;
            var lower = chunk.ToLowerInvariant();
            var score = 0;
            foreach (var term in queryTerms)
            {
                var idx = 0;
                while ((idx = lower.IndexOf(term, idx, StringComparison.Ordinal)) >= 0)
                {
                    score++;
                    idx += term.Length;
                }
            }
            return score;
        }

        private static float CosineSimilarity(float[] a, float[] b)
        {
            if (a.Length == 0 || b.Length == 0 || a.Length != b.Length) return 0f;
            double dot = 0, magA = 0, magB = 0;
            for (var i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                magA += a[i] * a[i];
                magB += b[i] * b[i];
            }
            var denom = Math.Sqrt(magA) * Math.Sqrt(magB);
            return denom <= 0 ? 0f : (float)(dot / denom);
        }
    }

    public record DeleteChatSessionCommand(Guid SessionId, Guid UserId) : IRequest;

    public sealed class DeleteChatSessionCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteChatSessionCommand>
    {
        public async Task Handle(DeleteChatSessionCommand cmd, CancellationToken ct)
        {
            var session = await db.ChatSessions
                .FirstOrDefaultAsync(s => s.Id == cmd.SessionId && s.UserId == cmd.UserId, ct)
                ?? throw new KeyNotFoundException("Session not found.");
            session.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
