using Microsoft.EntityFrameworkCore;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Session> Sessions { get; }
    DbSet<ExternalLogin> ExternalLogins { get; }
    //---Add the OneTimeTokens DbSet to the IAppDbContext interface----
    DbSet<OneTimeToken> OneTimeTokens { get; }
    // Stores the user's two-factor authentication secret.
    DbSet<TotpSecret> TotpSecrets { get; }
    // Backup codes for account recovery.
    DbSet<RecoveryCode> RecoveryCodes { get; }
    // Tracks GDPR/data export requests submitted by users.
    DbSet<DataExportRequest> DataExportRequests { get; }
    // Login history for auditing and security.
    DbSet<LoginAudit> LoginAudits { get; }
    // Records administrative actions performed in the system.
    DbSet<AdminAudit> AdminAudits { get; }

    DbSet<School> Schools { get; }
    DbSet<User> Users { get; }
    DbSet<Article> Articles { get; }
    DbSet<Category> Categories { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Like> Likes { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<RoleDefinition> RoleDefinitions { get; }
    DbSet<UserSchoolEnrollment> UserSchoolEnrollments { get; }
    DbSet<Notification> Notifications { get; }
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
    DbSet<VidyaAI.Domain.Entities.Narration> Narrations { get; }
    DbSet<VidyaAI.Domain.Entities.NarrationSegment> NarrationSegments { get; }
    // Academic structure (A1)
    DbSet<AcademicYear> AcademicYears { get; }
    DbSet<Term> Terms { get; }
    DbSet<SchoolClass> SchoolClasses { get; }
    DbSet<Section> Sections { get; }
    DbSet<Subject> Subjects { get; }
    DbSet<House> Houses { get; }
    DbSet<AcademicStream> Streams { get; }
    DbSet<SubjectAllocation> SubjectAllocations { get; }
    DbSet<GradingScale> GradingScales { get; }
    DbSet<GradeBand> GradeBands { get; }
    // Student Information System (A2)
    DbSet<Student> Students { get; }
    DbSet<Exam> Exams { get; }
    DbSet<ExamSubject> ExamSubjects { get; }
    DbSet<StudentExamResult> StudentExamResults { get; }
    // Transport (D4)
    DbSet<TransportVehicle> TransportVehicles { get; }
    DbSet<TransportRoute> TransportRoutes { get; }
    DbSet<TransportStop> TransportStops { get; }
    DbSet<StudentTransport> StudentTransports { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

// Current user context (from JWT)


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

// Verifies a captcha token (Google reCAPTCHA / Cloudflare Turnstile compatible).
// When no secret is configured, Enabled is false and verification is skipped so
// local/dev registration still works.
public interface ICaptchaVerifier
{
    bool Enabled { get; }
    Task<bool> VerifyAsync(string? token, CancellationToken ct = default);
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
    // Lists voices the engine offers (for a voice pick er).
    IReadOnlyList<TtsVoice> GetVoices();

    // Synthesizes all segments and stitches them into one audio file, returning the
    // bytes plus each segment's measured start/end offset.
    Task<TtsResult> SynthesizeAsync(IReadOnlyList<TtsSegment> segments, string? voiceId, CancellationToken ct = default);
}

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
