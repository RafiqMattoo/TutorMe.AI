using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Domain.Common;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Infrastructure.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<School> Schools => Set<School>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<CommentLike> CommentLikes => Set<CommentLike>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<RoleDefinition> RoleDefinitions => Set<RoleDefinition>();
    public DbSet<UserSchoolEnrollment> UserSchoolEnrollments => Set<UserSchoolEnrollment>();
    public DbSet<Material> Materials => Set<Material>();
    public DbSet<MaterialChunk> MaterialChunks => Set<MaterialChunk>();
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<FlashcardSet> FlashcardSets => Set<FlashcardSet>();
    public DbSet<Flashcard> Flashcards => Set<Flashcard>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();
    public DbSet<LessonPlan> LessonPlans => Set<LessonPlan>();
    public DbSet<Delivery> Deliveries => Set<Delivery>();
    public DbSet<Narration> Narrations => Set<Narration>();
    public DbSet<NarrationSegment> NarrationSegments => Set<NarrationSegment>();
    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();
    public DbSet<Term> Terms => Set<Term>();
    public DbSet<SchoolClass> SchoolClasses => Set<SchoolClass>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<House> Houses => Set<House>();
    public DbSet<AcademicStream> Streams => Set<AcademicStream>();
    public DbSet<SubjectAllocation> SubjectAllocations => Set<SubjectAllocation>();
    public DbSet<GradingScale> GradingScales => Set<GradingScale>();
    public DbSet<GradeBand> GradeBands => Set<GradeBand>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<TransportVehicle> TransportVehicles => Set<TransportVehicle>();
    public DbSet<TransportRoute> TransportRoutes => Set<TransportRoute>();
    public DbSet<TransportStop> TransportStops => Set<TransportStop>();
    public DbSet<StudentTransport> StudentTransports => Set<StudentTransport>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── SCHOOL ────────────────────────────────────────────────
        modelBuilder.Entity<School>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Email).HasMaxLength(200);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.Board).HasConversion<string>();
            e.Property(x => x.Type).HasConversion<string>();
            e.Property(x => x.Plan).HasConversion<string>();
            e.Property(x => x.SubscriptionStatus).HasConversion<string>();
            e.Property(x => x.ApprovalStatus).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.Email).IsUnique();
        });

        // ── USER ──────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(200).IsRequired();
            e.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
            e.Property(x => x.LastName).HasMaxLength(100).IsRequired();
            e.Property(x => x.Role).HasConversion<string>();
            e.Property(x => x.ApprovalStatus).HasConversion<string>();
            e.Property(x => x.GradeLevel).HasMaxLength(60);
            e.Property(x => x.RollNumber).HasMaxLength(60);
            e.Property(x => x.GuardianName).HasMaxLength(150);
            e.Property(x => x.GuardianPhone).HasMaxLength(30);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasOne(x => x.School).WithMany(x => x.Users)
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<UserSchoolEnrollment>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Role).HasConversion<string>();
            e.Property(x => x.Status).HasConversion<string>();
            e.HasIndex(x => new { x.UserId, x.SchoolId, x.Role }).IsUnique();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasOne(x => x.User).WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RolePermission>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Role).HasConversion<string>();
            e.Property(x => x.Module).HasConversion<string>();
            e.HasIndex(x => new { x.RoleDefinitionId, x.Module }).IsUnique();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasOne(x => x.RoleDefinition).WithMany()
                .HasForeignKey(x => x.RoleDefinitionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RoleDefinition>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(80).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(120).IsRequired();
            e.HasIndex(x => x.Name).IsUnique();
            e.HasQueryFilter(x => !x.IsDeleted);
        });

        // ── ARTICLE ───────────────────────────────────────────────
        modelBuilder.Entity<Article>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(500).IsRequired();
            e.Property(x => x.Status).HasConversion<string>();
            e.Property(x => x.ContentType).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.Status);
            e.HasIndex(x => x.PublishedAt);
            e.HasOne(x => x.Author).WithMany(x => x.Articles)
                .HasForeignKey(x => x.AuthorId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany(x => x.Articles)
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Category).WithMany(x => x.Articles)
                .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── CATEGORY ──────────────────────────────────────────────
        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.HasQueryFilter(x => !x.IsDeleted);
        });

        // ── COMMENT ───────────────────────────────────────────────
        modelBuilder.Entity<Comment>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasOne(x => x.Article).WithMany(x => x.Comments)
                .HasForeignKey(x => x.ArticleId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany(x => x.Comments)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.ParentComment).WithMany(x => x.Replies)
                .HasForeignKey(x => x.ParentCommentId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── COMMENT LIKE ──────────────────────────────────────────
        modelBuilder.Entity<CommentLike>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.CommentId, x.UserId }).IsUnique();
            e.HasOne(x => x.Comment).WithMany(x => x.CommentLikes)
                .HasForeignKey(x => x.CommentId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── LIKE ──────────────────────────────────────────────────
        modelBuilder.Entity<Like>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.ArticleId, x.UserId }).IsUnique();
            e.HasOne(x => x.Article).WithMany(x => x.Likes)
                .HasForeignKey(x => x.ArticleId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany(x => x.Likes)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── ANNOUNCEMENT ──────────────────────────────────────────
        modelBuilder.Entity<Announcement>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasOne(x => x.School).WithMany(x => x.Announcements)
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── USER PREFERENCE ───────────────────────────────────────
        modelBuilder.Entity<UserPreference>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.UserId, x.CategoryId }).IsUnique();
        });

        // ── NOTIFICATION ──────────────────────────────────────────
        modelBuilder.Entity<Notification>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Type).HasConversion<string>();
            e.HasIndex(x => new { x.UserId, x.IsRead });
        });

        // ── MATERIAL ──────────────────────────────────────────────
        modelBuilder.Entity<Material>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.FileName).HasMaxLength(300).IsRequired();
            e.Property(x => x.FileUrl).HasMaxLength(1000).IsRequired();
            e.Property(x => x.ContentType).HasMaxLength(100);
            e.Property(x => x.Status).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.UploadedById);
            e.HasOne(x => x.UploadedBy).WithMany()
                .HasForeignKey(x => x.UploadedById).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Category).WithMany()
                .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── MATERIAL CHUNK (vector) ───────────────────────────────
        modelBuilder.Entity<MaterialChunk>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).IsRequired();
            e.Property(x => x.Embedding).HasColumnType("real[]");
            e.HasIndex(x => x.MaterialId);
            e.HasIndex(x => new { x.MaterialId, x.ChunkIndex }).IsUnique();
            e.HasOne(x => x.Material).WithMany(x => x.Chunks)
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── CHAT SESSION ──────────────────────────────────────────
        modelBuilder.Entity<ChatSession>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.UserId);
            e.HasOne(x => x.User).WithMany()
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Material).WithMany(m => m.ChatSessions)
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── CHAT MESSAGE ──────────────────────────────────────────
        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).IsRequired();
            e.Property(x => x.Role).HasConversion<string>();
            e.HasIndex(x => x.SessionId);
            e.HasOne(x => x.Session).WithMany(s => s.Messages)
                .HasForeignKey(x => x.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── FLASHCARD SET ─────────────────────────────────────────
        modelBuilder.Entity<FlashcardSet>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.MaterialId);
            e.HasOne(x => x.Material).WithMany()
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.CreatedBy).WithMany()
                .HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Flashcard>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Front).IsRequired();
            e.Property(x => x.Back).IsRequired();
            e.HasIndex(x => x.SetId);
            e.HasOne(x => x.Set).WithMany(s => s.Cards)
                .HasForeignKey(x => x.SetId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── QUIZ ──────────────────────────────────────────────────
        modelBuilder.Entity<Quiz>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.Difficulty).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.MaterialId);
            e.HasOne(x => x.Material).WithMany()
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.CreatedBy).WithMany()
                .HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<QuizQuestion>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.QuestionText).IsRequired();
            e.Property(x => x.OptionsJson).HasColumnType("jsonb").IsRequired();
            e.HasIndex(x => x.QuizId);
            e.HasOne(x => x.Quiz).WithMany(q => q.Questions)
                .HasForeignKey(x => x.QuizId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizAttempt>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.AnswersJson).HasColumnType("jsonb").IsRequired();
            e.HasIndex(x => x.QuizId);
            e.HasIndex(x => x.UserId);
            e.HasOne(x => x.Quiz).WithMany(q => q.Attempts)
                .HasForeignKey(x => x.QuizId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany()
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── LESSON PLAN ───────────────────────────────────────────
        modelBuilder.Entity<LessonPlan>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.Subject).HasMaxLength(150);
            e.Property(x => x.GradeLevel).HasMaxLength(80);
            e.Property(x => x.ContentMarkdown).IsRequired();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.MaterialId);
            e.HasOne(x => x.Material).WithMany()
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.CreatedBy).WithMany()
                .HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── DELIVERY ──────────────────────────────────────────────
        modelBuilder.Entity<Delivery>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.GradeLevel).HasMaxLength(80);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => new { x.SchoolId, x.ScheduledDate });
            e.HasOne(x => x.Material).WithMany()
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Quiz).WithMany()
                .HasForeignKey(x => x.QuizId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.FlashcardSet).WithMany()
                .HasForeignKey(x => x.FlashcardSetId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.CreatedBy).WithMany()
                .HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.School).WithMany()
                .HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── NARRATION ─────────────────────────────────────────────
        modelBuilder.Entity<Narration>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Status).HasConversion<string>();
            e.Property(x => x.Kind).HasConversion<string>();
            e.Property(x => x.AudioUrl).HasMaxLength(1000);
            e.Property(x => x.ContentType).HasMaxLength(100);
            e.Property(x => x.Voice).HasMaxLength(100);
            e.HasQueryFilter(x => !x.IsDeleted);
            // One narration per material per kind — regenerating replaces that kind.
            e.HasIndex(x => new { x.MaterialId, x.Kind }).IsUnique();
            e.HasOne(x => x.Material).WithMany()
                .HasForeignKey(x => x.MaterialId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<NarrationSegment>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Text).IsRequired();
            e.HasIndex(x => x.NarrationId);
            e.HasIndex(x => new { x.NarrationId, x.SegmentIndex }).IsUnique();
            e.HasOne(x => x.Narration).WithMany(n => n.Segments)
                .HasForeignKey(x => x.NarrationId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── ACADEMIC STRUCTURE (A1) ───────────────────────────────
        modelBuilder.Entity<AcademicYear>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(50);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Term>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(50);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.AcademicYear).WithMany(y => y.Terms)
                .HasForeignKey(x => x.AcademicYearId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SchoolClass>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(60);
            e.Property(x => x.Stage).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Section>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(20);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.SchoolClassId);
            e.HasOne(x => x.SchoolClass).WithMany(c => c.Sections)
                .HasForeignKey(x => x.SchoolClassId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.ClassTeacher).WithMany()
                .HasForeignKey(x => x.ClassTeacherId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Stream).WithMany()
                .HasForeignKey(x => x.StreamId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Subject>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(80);
            e.Property(x => x.Code).HasMaxLength(20);
            e.Property(x => x.MediumOfInstruction).HasMaxLength(50);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<House>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(60);
            e.Property(x => x.ColorHex).HasMaxLength(9);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.HouseMaster).WithMany()
                .HasForeignKey(x => x.HouseMasterId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<AcademicStream>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(60);
            e.Property(x => x.Code).HasMaxLength(20);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SubjectAllocation>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => new { x.SchoolClassId, x.SectionId });
            e.HasOne(x => x.Subject).WithMany()
                .HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.SchoolClass).WithMany()
                .HasForeignKey(x => x.SchoolClassId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Section).WithMany()
                .HasForeignKey(x => x.SectionId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Teacher).WithMany()
                .HasForeignKey(x => x.TeacherId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<GradingScale>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(80);
            e.Property(x => x.Board).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GradeBand>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Grade).IsRequired().HasMaxLength(10);
            e.Property(x => x.MinPercent).HasPrecision(5, 2);
            e.Property(x => x.MaxPercent).HasPrecision(5, 2);
            e.Property(x => x.GradePoint).HasPrecision(4, 2);
            e.Property(x => x.Description).HasMaxLength(120);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.GradingScale).WithMany(s => s.Bands)
                .HasForeignKey(x => x.GradingScaleId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── STUDENT INFORMATION SYSTEM (A2) ───────────────────────
        modelBuilder.Entity<Student>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.AdmissionNumber).IsRequired().HasMaxLength(40);
            e.Property(x => x.RollNumber).HasMaxLength(20);
            e.Property(x => x.FirstName).IsRequired().HasMaxLength(80);
            e.Property(x => x.LastName).HasMaxLength(80);
            e.Property(x => x.Gender).HasConversion<string>();
            e.Property(x => x.Status).HasConversion<string>();
            e.Property(x => x.Category).HasConversion<string>();
            e.Property(x => x.Email).HasMaxLength(150);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.City).HasMaxLength(80);
            e.Property(x => x.State).HasMaxLength(80);
            e.Property(x => x.Pincode).HasMaxLength(12);
            e.Property(x => x.BloodGroup).HasMaxLength(5);
            e.Property(x => x.AadhaarNumber).HasMaxLength(20);
            e.Property(x => x.ApaarId).HasMaxLength(20);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => new { x.SchoolId, x.AdmissionNumber }).IsUnique();
            e.HasIndex(x => x.SectionId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.AcademicYear).WithMany().HasForeignKey(x => x.AcademicYearId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.SchoolClass).WithMany().HasForeignKey(x => x.SchoolClassId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Section).WithMany().HasForeignKey(x => x.SectionId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.House).WithMany().HasForeignKey(x => x.HouseId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── TRANSPORT (D4) ────────────────────────────────────────
        modelBuilder.Entity<TransportVehicle>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.RegistrationNumber).IsRequired().HasMaxLength(30);
            e.Property(x => x.Model).HasMaxLength(80);
            e.Property(x => x.DriverName).HasMaxLength(80);
            e.Property(x => x.DriverPhone).HasMaxLength(20);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => new { x.SchoolId, x.RegistrationNumber }).IsUnique();
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TransportRoute>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(80);
            e.Property(x => x.Code).HasMaxLength(20);
            e.Property(x => x.Fare).HasPrecision(10, 2);
            e.Property(x => x.FeeFrequency).HasConversion<string>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Vehicle).WithMany(v => v.Routes).HasForeignKey(x => x.VehicleId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TransportStop>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(80);
            e.Property(x => x.PickupTime).HasMaxLength(10);
            e.Property(x => x.DropTime).HasMaxLength(10);
            e.Property(x => x.StopFare).HasPrecision(10, 2);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => x.RouteId);
            e.HasOne(x => x.Route).WithMany(r => r.Stops).HasForeignKey(x => x.RouteId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudentTransport>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Fare).HasPrecision(10, 2);
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasIndex(x => x.SchoolId);
            e.HasIndex(x => new { x.SchoolId, x.StudentId });
            e.HasOne(x => x.Student).WithMany().HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Route).WithMany().HasForeignKey(x => x.RouteId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Stop).WithMany().HasForeignKey(x => x.StopId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── SEED DATA ─────────────────────────────────────────────
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var superAdminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var schoolId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        var cat1Id = Guid.Parse("00000000-0000-0000-0000-000000000003");
        var cat2Id = Guid.Parse("00000000-0000-0000-0000-000000000004");
        var cat3Id = Guid.Parse("00000000-0000-0000-0000-000000000005");
        var schoolAdminId = Guid.Parse("00000000-0000-0000-0000-000000000006");
        var teacherId = Guid.Parse("00000000-0000-0000-0000-000000000007");
        var studentId = Guid.Parse("00000000-0000-0000-0000-000000000008");
        var parentId = Guid.Parse("00000000-0000-0000-0000-000000000009");
        const string demoPasswordHash = "$2a$11$RIzKRlsKF6lh3k9LHQHsROIDjily/9oaxg5wL8JSVdSxmBRQv7WVm";

        modelBuilder.Entity<School>().HasData(new School
        {
            Id = schoolId, Name = "CodeStrix Demo School",
            City = "Srinagar", State = "J&K", Email = "demo@codestrix.com",
            Board = BoardType.CBSE, Type = SchoolType.Private,
            Plan = SubscriptionPlan.Pro, SubscriptionStatus = SubscriptionStatus.Active,
            SubscriptionExpiresAt = DateTime.UtcNow.AddYears(1), IsActive = true,
            CreatedAt = DateTime.UtcNow
        });

        modelBuilder.Entity<User>().HasData(new User
        {
            Id = superAdminId, FirstName = "Super", LastName = "Admin",
            Email = "admin@vidyaai.com",
            // Password: Admin@123 (bcrypt)
            PasswordHash = demoPasswordHash,
            Role = UserRole.SuperAdmin, IsActive = true, EmailVerified = true,
            SchoolId = schoolId, CreatedAt = DateTime.UtcNow
        },
        new User
        {
            Id = schoolAdminId, FirstName = "Aaliya", LastName = "Khan",
            Email = "schooladmin@vidyaai.com", PasswordHash = demoPasswordHash,
            Role = UserRole.SchoolAdmin, IsActive = true, EmailVerified = true,
            SchoolId = schoolId, CreatedAt = DateTime.UtcNow
        },
        new User
        {
            Id = teacherId, FirstName = "Rohan", LastName = "Sharma",
            Email = "teacher@vidyaai.com", PasswordHash = demoPasswordHash,
            Role = UserRole.Teacher, IsActive = true, EmailVerified = true,
            SchoolId = schoolId, CreatedAt = DateTime.UtcNow
        },
        new User
        {
            Id = studentId, FirstName = "Zoya", LastName = "Mir",
            Email = "student@vidyaai.com", PasswordHash = demoPasswordHash,
            Role = UserRole.Student, IsActive = true, EmailVerified = true,
            SchoolId = schoolId, CreatedAt = DateTime.UtcNow
        },
        new User
        {
            Id = parentId, FirstName = "Imran", LastName = "Mir",
            Email = "parent@vidyaai.com", PasswordHash = demoPasswordHash,
            Role = UserRole.Parent, IsActive = true, EmailVerified = true,
            SchoolId = schoolId, CreatedAt = DateTime.UtcNow
        });

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = cat1Id, Name = "Technology", SortOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow },
            new Category { Id = cat2Id, Name = "Science", SortOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow },
            new Category { Id = cat3Id, Name = "General Knowledge", SortOrder = 3, IsActive = true, CreatedAt = DateTime.UtcNow }
        );

        SeedRolePermissions(modelBuilder);
        SeedRoleDefinitions(modelBuilder);
        SeedEnrollments(modelBuilder, schoolId, superAdminId, schoolAdminId, teacherId, studentId, parentId);
    }

    private static void SeedRoleDefinitions(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoleDefinition>().HasData(
            new RoleDefinition { Id = Guid.Parse("30000000-0000-0000-0000-000000000001"), Name = "SuperAdmin", DisplayName = "Super Admin", Description = "Global platform owner with full operational control.", IsSystemRole = true, IsActive = true, CreatedAt = DateTime.UtcNow },
            new RoleDefinition { Id = Guid.Parse("30000000-0000-0000-0000-000000000002"), Name = "SchoolAdmin", DisplayName = "School Admin", Description = "Manages one school, its users, content, and operations.", IsSystemRole = true, IsActive = true, CreatedAt = DateTime.UtcNow },
            new RoleDefinition { Id = Guid.Parse("30000000-0000-0000-0000-000000000003"), Name = "Teacher", DisplayName = "Teacher", Description = "Creates learning content and supports study workflows.", IsSystemRole = true, IsActive = true, CreatedAt = DateTime.UtcNow },
            new RoleDefinition { Id = Guid.Parse("30000000-0000-0000-0000-000000000004"), Name = "Student", DisplayName = "Student", Description = "Learner workspace for study materials and practice.", IsSystemRole = true, IsActive = true, CreatedAt = DateTime.UtcNow },
            new RoleDefinition { Id = Guid.Parse("30000000-0000-0000-0000-000000000005"), Name = "Parent", DisplayName = "Parent", Description = "Guardian view into school learning content.", IsSystemRole = true, IsActive = true, CreatedAt = DateTime.UtcNow }
        );
    }

    private static void SeedRolePermissions(ModelBuilder modelBuilder)
    {
        var rows = new List<RolePermission>();
        var roleDefinitionIds = new Dictionary<UserRole, Guid>
        {
            [UserRole.SuperAdmin] = Guid.Parse("30000000-0000-0000-0000-000000000001"),
            [UserRole.SchoolAdmin] = Guid.Parse("30000000-0000-0000-0000-000000000002"),
            [UserRole.Teacher] = Guid.Parse("30000000-0000-0000-0000-000000000003"),
            [UserRole.Student] = Guid.Parse("30000000-0000-0000-0000-000000000004"),
            [UserRole.Parent] = Guid.Parse("30000000-0000-0000-0000-000000000005"),
        };

        void Add(int id, UserRole role, PermissionModule module, bool view, bool create = false, bool edit = false, bool delete = false, bool approve = false)
        {
            rows.Add(new RolePermission
            {
                Id = Guid.Parse($"10000000-0000-0000-0000-{id:000000000000}"),
                Role = role, RoleDefinitionId = roleDefinitionIds[role],
                Module = module, CanView = view, CanCreate = create,
                CanEdit = edit, CanDelete = delete, CanApprove = approve,
                CreatedAt = DateTime.UtcNow
            });
        }

        var i = 1;
        foreach (PermissionModule module in Enum.GetValues<PermissionModule>())
            Add(i++, UserRole.SuperAdmin, module, true, true, true, true, true);

        Add(i++, UserRole.SchoolAdmin, PermissionModule.Dashboard, true);
        Add(i++, UserRole.SchoolAdmin, PermissionModule.Users, true, true, true, true);
        Add(i++, UserRole.SchoolAdmin, PermissionModule.Roles, true);
        Add(i++, UserRole.SchoolAdmin, PermissionModule.Articles, true, true, true, false, true);
        Add(i++, UserRole.SchoolAdmin, PermissionModule.Categories, true, true, true);

        Add(i++, UserRole.Teacher, PermissionModule.Dashboard, true);
        Add(i++, UserRole.Teacher, PermissionModule.Articles, true, true, true);
        Add(i++, UserRole.Teacher, PermissionModule.Categories, true);

        Add(i++, UserRole.Student, PermissionModule.Dashboard, true);
        Add(i++, UserRole.Student, PermissionModule.Articles, true);
        Add(i++, UserRole.Student, PermissionModule.Categories, true);

        Add(i++, UserRole.Parent, PermissionModule.Dashboard, true);
        Add(i++, UserRole.Parent, PermissionModule.Articles, true);
        Add(i++, UserRole.Parent, PermissionModule.Categories, true);

        modelBuilder.Entity<RolePermission>().HasData(rows);
    }

    private static void SeedEnrollments(ModelBuilder modelBuilder, Guid schoolId, params Guid[] userIds)
    {
        var roles = new[] { UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher, UserRole.Student, UserRole.Parent };
        var rows = userIds.Select((userId, index) => new UserSchoolEnrollment
        {
            Id = Guid.Parse($"20000000-0000-0000-0000-{index + 1:000000000000}"),
            UserId = userId,
            SchoolId = schoolId,
            Role = roles[index],
            Status = EnrollmentStatus.Active,
            IsPrimary = true,
            EnrolledAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        }).ToArray();

        modelBuilder.Entity<UserSchoolEnrollment>().HasData(rows);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return await base.SaveChangesAsync(ct);
    }
}
