using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── SCHOOL ────────────────────────────────────────────────────────
public class School : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? LogoUrl { get; set; }
    // Optional uploaded registration document (URL returned by storage service)
    public string? DocumentUrl { get; set; }
    public SchoolType Type { get; set; } = SchoolType.Private;
    public BoardType Board { get; set; } = BoardType.CBSE;
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Trial;
    public DateTime? SubscriptionExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    // Self-registered schools start Pending and need SuperAdmin approval; schools
    // created directly by a SuperAdmin default to Approved.
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Approved;

    public ICollection<User> Users { get; set; } = [];
    public ICollection<Article> Articles { get; set; } = [];
    public ICollection<Announcement> Announcements { get; set; } = [];
}

// ── USER ──────────────────────────────────────────────────────────
public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; } = UserRole.Student;
    public bool IsActive { get; set; } = true;
    public bool EmailVerified { get; set; } = false;
    // Self-registered teachers/students start Pending and need SchoolAdmin approval;
    // users created directly by an admin default to Approved.
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Approved;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // ── Student profile (prominent when a school enrolls a student) ──
    public string? GradeLevel { get; set; }      // e.g. "Class 8" / "Grade 10"
    public string? RollNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }

    public ICollection<Article> Articles { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Like> Likes { get; set; } = [];
    public ICollection<UserPreference> Preferences { get; set; } = [];
    public ICollection<UserSchoolEnrollment> Enrollments { get; set; } = [];
}

public class UserSchoolEnrollment : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;
    public UserRole Role { get; set; } = UserRole.Student;
    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;
    public bool IsPrimary { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
}

public class RolePermission : BaseEntity
{
    public UserRole? Role { get; set; }
    public Guid? RoleDefinitionId { get; set; }
    public RoleDefinition? RoleDefinition { get; set; }
    public PermissionModule Module { get; set; }
    public bool CanView { get; set; }
    public bool CanCreate { get; set; }
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
    public bool CanApprove { get; set; }
}

public class RoleDefinition : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystemRole { get; set; }
    public bool IsActive { get; set; } = true;
}

// ── ARTICLE ───────────────────────────────────────────────────────
public class Article : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Summary { get; set; }           // AI generated
    public string? AiSummary { get; set; }         // AI generated summary
    public string? CoverImageUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public ContentType ContentType { get; set; } = ContentType.Text;
    public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
    public string? Tags { get; set; }              // comma separated
    public int ViewCount { get; set; } = 0;
    public DateTime? PublishedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }

    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Like> Likes { get; set; } = [];
}

// ── CATEGORY ──────────────────────────────────────────────────────
public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public ICollection<Article> Articles { get; set; } = [];
}

// ── COMMENT ───────────────────────────────────────────────────────
public class Comment : BaseEntity
{
    public string Content { get; set; } = string.Empty;
    public int LikeCount { get; set; } = 0;

    public Guid ArticleId { get; set; }
    public Article Article { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = [];
    public ICollection<CommentLike> CommentLikes { get; set; } = [];
}

// ── COMMENT LIKE ─────────────────────────────────────────────────
public class CommentLike : BaseEntity
{
    public Guid CommentId { get; set; }
    public Comment Comment { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}

// ── LIKE ──────────────────────────────────────────────────────────
public class Like : BaseEntity
{
    public Guid ArticleId { get; set; }
    public Article Article { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}

// ── ANNOUNCEMENT ─────────────────────────────────────────────────
public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }

    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;
    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;
}

// ── USER PREFERENCE ───────────────────────────────────────────────
public class UserPreference : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

// ── NOTIFICATION ─────────────────────────────────────────────────
public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public string? ReferenceId { get; set; }
}
