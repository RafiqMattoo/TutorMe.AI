using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Application.Common.Interfaces;

public interface IVideoService
{
    Task<IReadOnlyList<VideoDto>> GetVideosAsync(
        string? query,
        int page,
        int pageSize,
        CancellationToken cancellationToken);
}