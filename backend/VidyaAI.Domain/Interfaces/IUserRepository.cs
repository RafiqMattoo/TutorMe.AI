using VidyaAI.Domain.Common;
using VidyaAI.Domain.Entities;

namespace VidyaAI.Domain.Interfaces;
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
}
