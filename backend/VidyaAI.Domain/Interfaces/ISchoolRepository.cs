using VidyaAI.Domain.Common;
using VidyaAI.Domain.Entities;


namespace VidyaAI.Domain.Interfaces
{
    public interface ISchoolRepository : IRepository<School>
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    }
}
