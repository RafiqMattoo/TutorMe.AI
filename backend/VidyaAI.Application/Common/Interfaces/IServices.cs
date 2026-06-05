using Microsoft.EntityFrameworkCore;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<School> Schools { get; }
    DbSet<User> Users { get; }
    DbSet<Article> Articles { get; }
    DbSet<Category> Categories { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Like> Likes { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<RoleDefinition> RoleDefinitions { get; }
    DbSet<UserSchoolEnrollment> UserSchoolEnrollments { get; }
    DbSet<Material> Materials { get; }
    DbSet<MaterialChunk> MaterialChunks { get; }
    DbSet<ChatSession> ChatSessions { get; }
    DbSet<ChatMessage> ChatMessages { get; }
    DbSet<FlashcardSet> FlashcardSets { get; }
    DbSet<Flashcard> Flashcards { get; }
    DbSet<Quiz> Quizzes { get; }
    DbSet<QuizQuestion> QuizQuestions { get; }
    DbSet<QuizAttempt> QuizAttempts { get; }
    DbSet<LessonPlan> LessonPlans { get; }
    DbSet<Delivery> Deliveries { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

// Current user context (from JWT)
public interface ICurrentUser
{
    Guid UserId { get; }
    string Email { get; }
    string Role { get; }
    Guid? SchoolId { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
}

// Cache abstraction over Redis
public interface ICacheService
{
    Task<T?> GetAsync<T>(string key, CancellationToken ct = default);
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken ct = default);
    Task RemoveAsync(string key, CancellationToken ct = default);
    Task RemoveByPrefixAsync(string prefix, CancellationToken ct = default);
}

// Email service abstraction
public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default);
    Task SendCommentLikedNotificationAsync(string to, string commenterName, string articleTitle, CancellationToken ct = default);
    Task SendWelcomeEmailAsync(string to, string name, CancellationToken ct = default);
}

// File/blob storage abstraction
public interface IStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default);
    Task DeleteAsync(string fileUrl, CancellationToken ct = default);
}

// JWT token service
public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string email, string role, Guid? schoolId);
    string GenerateRefreshToken();
}

// AI summarisation
public interface IAiService
{
    Task<string> SummariseAsync(string text, CancellationToken ct = default);
}

// Generates vector embeddings for one or many text inputs.
public interface IEmbeddingService
{
    int Dimensions { get; }
    Task<float[]> EmbedAsync(string text, CancellationToken ct = default);
    Task<IReadOnlyList<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts, CancellationToken ct = default);
}

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

public sealed record PdfText(string Text, int PageNumber);

public interface IPdfTextExtractor
{
    IEnumerable<PdfText> Extract(Stream pdfStream);
}

public sealed record TextChunk(string Content, int Index, int? PageNumber, int TokenCount);

public interface ITextChunker
{
    IReadOnlyList<TextChunk> Chunk(IEnumerable<PdfText> pages);
}

// Thrown by LLM/embedding services when the upstream API returns a non-success
// response. Carries the HTTP status code so handlers can surface useful messages.
public sealed class LlmApiException(int statusCode, string message, string rawBody)
    : Exception(message)
{
    public int StatusCode { get; } = statusCode;
    public string RawBody { get; } = rawBody;
}
