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

public interface IUnitOfWork
{
    ISchoolRepository Schools { get; }
    IUserRepository Users { get; }
    IArticleRepository Articles { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
