using MediatR;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Application.Videos.Queries.GetVideos;

public sealed class GetVideosHandler(
    IVideoService videoService)
    : IRequestHandler<GetVideosQuery, IReadOnlyList<VideoDto>>
{
    public async Task<IReadOnlyList<VideoDto>> Handle(
        GetVideosQuery request,
        CancellationToken cancellationToken)
    {
        return await videoService.GetVideosAsync(
            request.Query,
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}