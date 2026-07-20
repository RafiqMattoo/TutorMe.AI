using VidyaAI.Domain.Common;
using VidyaAI.Domain.Entities;


namespace VidyaAI.Domain.Interfaces
{
    public interface IArticleRepository : IRepository<Article>
    {
        Task<int> GetLikeCountAsync(Guid articleId, CancellationToken ct = default);
        Task<int> GetCommentCountAsync(Guid articleId, CancellationToken ct = default);
    }
}
