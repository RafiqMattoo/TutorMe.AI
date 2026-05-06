using VidyaAI.Domain.Common;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Domain.Interfaces;

// Generic repository interface
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}

public interface ISchoolRepository : IRepository<School>
{
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
}

public interface IArticleRepository : IRepository<Article>
{
    Task<int> GetLikeCountAsync(Guid articleId, CancellationToken ct = default);
    Task<int> GetCommentCountAsync(Guid articleId, CancellationToken ct = default);
}

public interface IUnitOfWork
{
    ISchoolRepository Schools { get; }
    IUserRepository Users { get; }
    IArticleRepository Articles { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
