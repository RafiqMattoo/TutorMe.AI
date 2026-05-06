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
