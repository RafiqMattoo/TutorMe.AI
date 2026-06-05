using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.DTOs;

// ── AUTH ──────────────────────────────────────────────────────────
public record LoginRequest(string Email, string Password);
public record LoginResponse(string AccessToken, string RefreshToken, UserDto User);
public record RefreshTokenRequest(string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

// ── USER ──────────────────────────────────────────────────────────
public record UserDto(
    Guid Id, string FirstName, string LastName, string Email,
    string? Phone, string? AvatarUrl, UserRole Role,
    bool IsActive, bool EmailVerified, DateTime? LastLoginAt,
    Guid? SchoolId, string? SchoolName, DateTime CreatedAt);

public record CreateUserRequest(
    string FirstName, string LastName, string Email, string Password,
    string? Phone, UserRole Role, Guid? SchoolId);

public record UpdateUserRequest(
    string FirstName, string LastName, string? Phone,
    string? AvatarUrl, bool IsActive);

public record RolePermissionDto(
    Guid Id, Guid RoleDefinitionId, string RoleName, string RoleDisplayName, PermissionModule Module,
    bool CanView, bool CanCreate, bool CanEdit, bool CanDelete, bool CanApprove);

public record UpsertRolePermissionRequest(
    Guid RoleDefinitionId, PermissionModule Module,
    bool CanView, bool CanCreate, bool CanEdit, bool CanDelete, bool CanApprove);

public record RoleDefinitionDto(
    Guid Id, string Name, string DisplayName, string? Description,
    bool IsSystemRole, bool IsActive, DateTime CreatedAt);

public record CreateRoleDefinitionRequest(
    string Name, string DisplayName, string? Description, bool IsActive);

public record UpdateRoleDefinitionRequest(
    string DisplayName, string? Description, bool IsActive);

public record UserSchoolEnrollmentDto(
    Guid Id, Guid UserId, string UserName, Guid SchoolId, string SchoolName,
    UserRole Role, EnrollmentStatus Status, bool IsPrimary, DateTime EnrolledAt);

public record CreateUserSchoolEnrollmentRequest(
    Guid UserId, Guid SchoolId, UserRole Role, EnrollmentStatus Status, bool IsPrimary);

// ── SCHOOL ────────────────────────────────────────────────────────
public record SchoolDto(
    Guid Id, string Name, string? Address, string? City, string? State,
    string? Phone, string? Email, string? LogoUrl,
    SchoolType Type, BoardType Board,
    SubscriptionPlan Plan, SubscriptionStatus SubscriptionStatus,
    DateTime? SubscriptionExpiresAt, bool IsActive,
    int TotalUsers, int TotalArticles, DateTime CreatedAt);

public record CreateSchoolRequest(
    string Name, string? Address, string? City, string? State,
    string? Phone, string? Email, SchoolType Type, BoardType Board,
    SubscriptionPlan Plan);

public record UpdateSchoolRequest(
    string Name, string? Address, string? City, string? State,
    string? Phone, string? Email, string? LogoUrl,
    SchoolType Type, BoardType Board, bool IsActive,
    SubscriptionPlan Plan, SubscriptionStatus SubscriptionStatus,
    DateTime? SubscriptionExpiresAt);

// ── ARTICLE ───────────────────────────────────────────────────────
public record ArticleDto(
    Guid Id, string Title, string Body, string? Summary, string? AiSummary,
    string? CoverImageUrl, string? YoutubeUrl,
    ContentType ContentType, ArticleStatus Status,
    string? Tags, int ViewCount, int LikeCount, int CommentCount,
    DateTime? PublishedAt, DateTime? ScheduledAt,
    Guid AuthorId, string AuthorName,
    Guid? SchoolId, string? SchoolName,
    Guid? CategoryId, string? CategoryName,
    DateTime CreatedAt);

public record ArticleListDto(
    Guid Id, string Title, string? CoverImageUrl,
    ContentType ContentType, ArticleStatus Status,
    string? Tags, int ViewCount, int LikeCount, int CommentCount,
    DateTime? PublishedAt, string AuthorName,
    string? CategoryName, DateTime CreatedAt);

public record CreateArticleRequest(
    string Title, string Body, string? CoverImageUrl, string? YoutubeUrl,
    ContentType ContentType, string? Tags,
    Guid? CategoryId, Guid? SchoolId, DateTime? ScheduledAt);

public record UpdateArticleRequest(
    string Title, string Body, string? CoverImageUrl, string? YoutubeUrl,
    ContentType ContentType, string? Tags,
    Guid? CategoryId, DateTime? ScheduledAt);

public record PublishArticleRequest(DateTime? ScheduledAt);

// ── CATEGORY ──────────────────────────────────────────────────────
public record CategoryDto(
    Guid Id, string Name, string? Description,
    string? IconUrl, int SortOrder, bool IsActive, int ArticleCount);

public record CreateCategoryRequest(string Name, string? Description, string? IconUrl, int SortOrder);
public record UpdateCategoryRequest(string Name, string? Description, string? IconUrl, int SortOrder, bool IsActive);

// ── COMMENT ───────────────────────────────────────────────────────
public record CommentDto(
    Guid Id, string Content, int LikeCount,
    Guid ArticleId, Guid UserId, string UserName, string? UserAvatar,
    Guid? ParentCommentId, int ReplyCount, DateTime CreatedAt);

// ── DASHBOARD ─────────────────────────────────────────────────────
public record DashboardStatsDto(
    int TotalSchools, int TotalUsers, int TotalArticles,
    int TotalStudents, int TotalTeachers,
    int PublishedArticles, int DraftArticles,
    int TotalLikes, int TotalComments, int TotalViews,
    int NewUsersThisWeek, int NewArticlesThisWeek,
    IReadOnlyList<TopArticleDto> TopArticles,
    IReadOnlyList<RecentActivityDto> RecentActivity);

public record TopArticleDto(
    Guid Id, string Title, int ViewCount, int LikeCount,
    int CommentCount, string AuthorName, DateTime? PublishedAt);

public record RecentActivityDto(
    string Type, string Description, string? UserName, DateTime OccurredAt);

// ── PAGINATION ────────────────────────────────────────────────────
public record PagedResult<T>(
    IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public record PaginationQuery(int Page = 1, int PageSize = 20, string? Search = null, string? SortBy = null, string? SortDir = "desc");

// ── ANNOUNCEMENT ─────────────────────────────────────────────────
public record AnnouncementDto(
    Guid Id, string Title, string Content, bool IsActive,
    DateTime? ExpiresAt, string SchoolName, string CreatedByName, DateTime CreatedAt);

public record CreateAnnouncementRequest(string Title, string Content, Guid SchoolId, DateTime? ExpiresAt);

// ── MATERIAL ─────────────────────────────────────────────────────
public record MaterialDto(
    Guid Id, string Title, string FileName, string FileUrl, string ContentType,
    long FileSize, int PageCount, MaterialStatus Status, string? ErrorMessage,
    Guid UploadedById, string UploadedByName,
    Guid? SchoolId, Guid? CategoryId, string? CategoryName,
    int ChunkCount, DateTime CreatedAt);

public record MaterialChunkDto(Guid Id, int ChunkIndex, int? PageNumber, string Content);

// ── TUTOR / CHAT ─────────────────────────────────────────────────
public record ChatSessionDto(
    Guid Id, string Title, Guid? MaterialId, string? MaterialTitle,
    int MessageCount, DateTime CreatedAt);

public record ChunkCitationDto(Guid ChunkId, int? PageNumber, string Snippet);

public record ChatMessageDto(
    Guid Id, ChatRole Role, string Content,
    IReadOnlyList<ChunkCitationDto> Citations, DateTime CreatedAt);

public record AskTutorRequest(Guid? SessionId, Guid? MaterialId, string Question);

public record AskTutorResponse(Guid SessionId, ChatMessageDto Message);

// One event in the streamed (SSE) tutor response.
//   Type "meta"  → SessionId set (sent first).
//   Type "token" → Delta carries the next piece of text.
//   Type "done"  → SessionId, Citations and MessageId finalise the message.
public record TutorStreamEvent(
    string Type, Guid? SessionId, string? Delta,
    IReadOnlyList<ChunkCitationDto>? Citations, Guid? MessageId);

// ── FLASHCARDS ───────────────────────────────────────────────────
public record FlashcardDto(Guid Id, int OrderIndex, string Front, string Back);

public record FlashcardSetDto(
    Guid Id, string Title, string? Description, int CardCount,
    Guid? MaterialId, string? MaterialTitle,
    string CreatedByName, DateTime CreatedAt,
    IReadOnlyList<FlashcardDto> Cards);

public record FlashcardSetSummaryDto(
    Guid Id, string Title, string? Description, int CardCount,
    Guid? MaterialId, string? MaterialTitle,
    string CreatedByName, DateTime CreatedAt);

public record GenerateFlashcardsRequest(Guid MaterialId, string? Title, int Count);

// ── QUIZZES ──────────────────────────────────────────────────────
public record QuizQuestionDto(
    Guid Id, int OrderIndex, string QuestionText,
    IReadOnlyList<string> Options, int? CorrectIndex, string? Explanation);

public record QuizDto(
    Guid Id, string Title, string? Description, int QuestionCount,
    QuizDifficulty Difficulty,
    Guid? MaterialId, string? MaterialTitle,
    string CreatedByName, DateTime CreatedAt,
    IReadOnlyList<QuizQuestionDto> Questions);

public record QuizSummaryDto(
    Guid Id, string Title, int QuestionCount, QuizDifficulty Difficulty,
    Guid? MaterialId, string? MaterialTitle, int AttemptCount,
    string CreatedByName, DateTime CreatedAt);

public record GenerateQuizRequest(Guid MaterialId, string? Title, int Count, QuizDifficulty Difficulty);

public record SubmitQuizAttemptRequest(IReadOnlyDictionary<Guid, int> Answers);

public record QuizAttemptResultDto(
    Guid Id, Guid QuizId, int Score, int TotalQuestions,
    DateTime CompletedAt,
    IReadOnlyList<QuizQuestionResultDto> Questions);

public record QuizQuestionResultDto(
    Guid QuestionId, string QuestionText, IReadOnlyList<string> Options,
    int CorrectIndex, int? SelectedIndex, bool IsCorrect, string? Explanation);

// ── LESSON PLANS ─────────────────────────────────────────────────
public record LessonPlanDto(
    Guid Id, string Title, string? Subject, string? GradeLevel,
    int DurationMinutes, string ContentMarkdown,
    Guid? MaterialId, string? MaterialTitle,
    string CreatedByName, DateTime CreatedAt);

public record LessonPlanSummaryDto(
    Guid Id, string Title, string? Subject, string? GradeLevel,
    int DurationMinutes, Guid? MaterialId, string? MaterialTitle,
    string CreatedByName, DateTime CreatedAt);

public record GenerateLessonPlanRequest(
    Guid MaterialId, string? Title, string? Subject, string? GradeLevel, int DurationMinutes);

// ── DELIVERIES (Delivered Today) ──────────────────────────────────
public record DeliveryDto(
    Guid Id, string Title, string? Instructions,
    DateOnly ScheduledDate, string? GradeLevel,
    Guid? MaterialId, string? MaterialTitle, string? MaterialStatus, string? MaterialFileUrl,
    Guid? QuizId, string? QuizTitle, int? QuizQuestionCount,
    Guid? FlashcardSetId, string? FlashcardSetTitle, int? FlashcardCardCount,
    string CreatedByName, DateTime CreatedAt);

public record CreateDeliveryRequest(
    string Title, string? Instructions, DateOnly ScheduledDate, string? GradeLevel,
    Guid? MaterialId, Guid? QuizId, Guid? FlashcardSetId);
