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
