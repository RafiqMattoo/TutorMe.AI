using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.DTOs;

// ── AUTH ──────────────────────────────────────────────────────────
public record LoginRequest(string Email, string Password);
public record LoginResponse(string AccessToken, string RefreshToken, UserDto User);
public record RefreshTokenRequest(string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

// ── SELF-REGISTRATION (public, no auth) ───────────────────────────
public record RegisterSchoolRequest(
    string SchoolName, string? City, string? State, string? Phone, string? Email,
    SchoolType Type, BoardType Board,
    string? CaptchaToken = null);

public record RegisterMemberRequest(
    Guid SchoolId, UserRole Role,                 // Teacher or Student only
    string FirstName, string LastName, string Email, string Password, string? Phone,
    string? GradeLevel, string? RollNumber, DateTime? DateOfBirth,
    string? GuardianName, string? GuardianPhone,
    string? CaptchaToken = null);

public record RegisterResponse(string Message);

// Minimal school info exposed publicly so a member can pick their school at signup.
public record PublicSchoolDto(Guid Id, string Name, string? City, string? State);

// ── USER ──────────────────────────────────────────────────────────
public record UserDto(
    Guid Id, string FirstName, string LastName, string Email,
    string? Phone, string? AvatarUrl, UserRole Role,
    bool IsActive, bool EmailVerified, DateTime? LastLoginAt,
    Guid? SchoolId, string? SchoolName, DateTime CreatedAt,
    ApprovalStatus ApprovalStatus, string? GradeLevel, string? RollNumber,
    DateTime? DateOfBirth, string? GuardianName, string? GuardianPhone);

public record CreateUserRequest(
    string FirstName, string LastName, string Email, string Password,
    string? Phone, UserRole Role, Guid? SchoolId,
    string? GradeLevel, string? RollNumber, DateTime? DateOfBirth,
    string? GuardianName, string? GuardianPhone);

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
    int TotalUsers, int TotalArticles, DateTime CreatedAt,
    ApprovalStatus ApprovalStatus);

// ── APPROVALS & NOTIFICATIONS ─────────────────────────────────────
public record PendingSchoolDto(
    Guid Id, string Name, string? City, string? State, SchoolType Type, BoardType Board,
    string? AdminName, string? AdminEmail, DateTime CreatedAt);

public record PendingMemberDto(
    Guid Id, string FirstName, string LastName, string Email, UserRole Role,
    Guid? SchoolId, string? SchoolName, string? GradeLevel, string? RollNumber, DateTime CreatedAt);

public record NotificationDto(
    Guid Id, NotificationType Type, string Title, string Message, bool IsRead,
    string? ReferenceId, DateTime CreatedAt);

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

// ── NARRATION (audio + read-along timeline) ───────────────────────
public record NarrationSegmentDto(
    int SegmentIndex, int ChunkIndex, int? PageNumber, string Text, int StartMs, int EndMs, string? ImageUrl);

public record NarrationDto(
    Guid Id, Guid MaterialId, NarrationKind Kind, NarrationStatus Status, string? AudioUrl, string ContentType,
    string? Voice, int DurationMs, string? ErrorMessage,
    IReadOnlyList<NarrationSegmentDto> Segments, DateTime CreatedAt);

public record NarrationVoiceDto(string Id, string Name, string Language);

public record GenerateNarrationRequest(string? Voice, NarrationKind Kind = NarrationKind.Verbatim);

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

// ── SIMPLE BOT ───────────────────────────────────────────────────
public record SimpleBotTurnDto(string Role, string Content);

public record AskSimpleBotRequest(string Message, IReadOnlyList<SimpleBotTurnDto>? History);

public record SimpleBotResponse(string Reply);

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

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
public record AcademicYearDto(
    Guid Id, Guid SchoolId, string Name, DateTime StartDate, DateTime EndDate,
    bool IsCurrent, IReadOnlyList<TermDto> Terms, DateTime CreatedAt);
public record TermDto(
    Guid Id, Guid AcademicYearId, string Name, DateTime StartDate, DateTime EndDate, int SortOrder);
public record SaveAcademicYearRequest(string Name, DateTime StartDate, DateTime EndDate, bool IsCurrent, Guid? SchoolId);
public record SaveTermRequest(string Name, DateTime StartDate, DateTime EndDate, int SortOrder);

public record SchoolClassDto(
    Guid Id, Guid SchoolId, string Name, SchoolStage Stage, int Level, int SectionCount, DateTime CreatedAt);
public record SaveSchoolClassRequest(string Name, SchoolStage Stage, int Level, Guid? SchoolId);

public record SectionDto(
    Guid Id, Guid SchoolId, Guid SchoolClassId, string SchoolClassName, string Name,
    int Capacity, Guid? ClassTeacherId, string? ClassTeacherName,
    Guid? StreamId, string? StreamName, DateTime CreatedAt);
public record SaveSectionRequest(Guid SchoolClassId, string Name, int Capacity, Guid? ClassTeacherId, Guid? StreamId);

public record SubjectDto(
    Guid Id, Guid SchoolId, string Name, string? Code, string? MediumOfInstruction,
    bool IsLanguage, bool IsCoScholastic, DateTime CreatedAt);
public record SaveSubjectRequest(
    string Name, string? Code, string? MediumOfInstruction, bool IsLanguage, bool IsCoScholastic, Guid? SchoolId);

public record HouseDto(
    Guid Id, Guid SchoolId, string Name, string? ColorHex, Guid? HouseMasterId, string? HouseMasterName, DateTime CreatedAt);
public record SaveHouseRequest(string Name, string? ColorHex, Guid? HouseMasterId, Guid? SchoolId);

// Streams / academic tracks (Science, Commerce, Humanities …)
public record StreamDto(Guid Id, Guid SchoolId, string Name, string? Code, DateTime CreatedAt);
public record SaveStreamRequest(string Name, string? Code, Guid? SchoolId);

// Subject–teacher–class mapping (subject allocation)
public record SubjectAllocationDto(
    Guid Id, Guid SchoolId, Guid SubjectId, string SubjectName,
    Guid SchoolClassId, string SchoolClassName, Guid? SectionId, string? SectionName,
    Guid TeacherId, string TeacherName, DateTime CreatedAt);
public record SaveSubjectAllocationRequest(
    Guid SubjectId, Guid SchoolClassId, Guid? SectionId, Guid TeacherId, Guid? SchoolId);

// Minimal teacher option for pickers (class teacher, house master, allocation).
public record TeacherOptionDto(Guid Id, string Name);

// Configurable grading scales (CBSE 9-point, ICSE, JKBOSE …) with percentage bands.
public record GradeBandDto(
    Guid Id, Guid GradingScaleId, string Grade, decimal MinPercent, decimal MaxPercent,
    decimal? GradePoint, string? Description);
public record GradingScaleDto(
    Guid Id, Guid SchoolId, string Name, BoardType? Board, bool IsDefault,
    IReadOnlyList<GradeBandDto> Bands, DateTime CreatedAt);
public record SaveGradingScaleRequest(string Name, BoardType? Board, bool IsDefault, Guid? SchoolId);
public record SaveGradeBandRequest(
    string Grade, decimal MinPercent, decimal MaxPercent, decimal? GradePoint, string? Description);

// ── STUDENT INFORMATION SYSTEM (A2) ───────────────────────────────
public record StudentListDto(
    Guid Id, string AdmissionNumber, string? RollNumber, string FullName,
    Gender Gender, StudentCategory Category, StudentStatus Status,
    Guid? SchoolClassId, string? ClassName, string? SectionName, string? PhotoUrl, DateTime AdmissionDate);

public record StudentDto(
    Guid Id, Guid SchoolId, string AdmissionNumber, string? RollNumber,
    string FirstName, string LastName, Gender Gender, DateTime DateOfBirth, DateTime AdmissionDate,
    StudentStatus Status, string? PhotoUrl,
    Guid? AcademicYearId, Guid? SchoolClassId, string? ClassName, Guid? SectionId, string? SectionName,
    Guid? HouseId, string? HouseName,
    string? Email, string? Phone, string? Address, string? City, string? State, string? Pincode,
    StudentCategory Category, string? BloodGroup, string? Nationality, string? MotherTongue, string? Religion,
    bool IsCwsn, string? CwsnNature, bool IsRte, string? AadhaarNumber, string? ApaarId,
    string? FatherName, string? FatherPhone, string? FatherOccupation,
    string? MotherName, string? MotherPhone, string? MotherOccupation,
    string? GuardianName, string? GuardianPhone, string? GuardianEmail, string? GuardianRelation,
    DateTime CreatedAt);

public record SaveStudentRequest(
    string AdmissionNumber, string? RollNumber, string FirstName, string LastName,
    Gender Gender, DateTime DateOfBirth, DateTime AdmissionDate, StudentStatus Status, string? PhotoUrl,
    Guid? AcademicYearId, Guid? SchoolClassId, Guid? SectionId, Guid? HouseId,
    string? Email, string? Phone, string? Address, string? City, string? State, string? Pincode,
    StudentCategory Category, string? BloodGroup, string? Nationality, string? MotherTongue, string? Religion,
    bool IsCwsn, string? CwsnNature, bool IsRte, string? AadhaarNumber, string? ApaarId,
    string? FatherName, string? FatherPhone, string? FatherOccupation,
    string? MotherName, string? MotherPhone, string? MotherOccupation,
    string? GuardianName, string? GuardianPhone, string? GuardianEmail, string? GuardianRelation,
    Guid? SchoolId);

// Minimal student option for pickers (transport, timetable, fees …).
public record StudentOptionDto(Guid Id, string Name, string AdmissionNumber, string? ClassName);

// ── TRANSPORT (D4) ────────────────────────────────────────────────
public record TransportVehicleDto(
    Guid Id, Guid SchoolId, string RegistrationNumber, string? Model, int Capacity,
    string? DriverName, string? DriverPhone, string? Notes, bool IsActive, int RouteCount, DateTime CreatedAt);
public record SaveTransportVehicleRequest(
    string RegistrationNumber, string? Model, int Capacity, string? DriverName, string? DriverPhone,
    string? Notes, bool IsActive, Guid? SchoolId);

public record TransportRouteDto(
    Guid Id, Guid SchoolId, string Name, string? Code, string? Description,
    Guid? VehicleId, string? VehicleName, decimal Fare, TransportFeeFrequency FeeFrequency, bool IsActive,
    int StopCount, int StudentCount, DateTime CreatedAt);
public record SaveTransportRouteRequest(
    string Name, string? Code, string? Description, Guid? VehicleId,
    decimal Fare, TransportFeeFrequency FeeFrequency, bool IsActive, Guid? SchoolId);

public record TransportStopDto(
    Guid Id, Guid SchoolId, Guid RouteId, string Name, int SortOrder,
    string? PickupTime, string? DropTime, decimal? StopFare, DateTime CreatedAt);
public record SaveTransportStopRequest(
    Guid RouteId, string Name, int SortOrder, string? PickupTime, string? DropTime, decimal? StopFare, Guid? SchoolId);

public record StudentTransportDto(
    Guid Id, Guid SchoolId, Guid StudentId, string StudentName, string AdmissionNumber,
    Guid RouteId, string RouteName, Guid? StopId, string? StopName, decimal Fare, bool IsActive, DateTime CreatedAt);
public record SaveStudentTransportRequest(
    Guid StudentId, Guid RouteId, Guid? StopId, decimal Fare, bool IsActive, Guid? SchoolId);
