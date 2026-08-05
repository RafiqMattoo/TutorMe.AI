using MediatR;
using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Application.Videos.Queries.GetVideos;

public sealed record GetVideosQuery(
    string? Query,
    int Page = 1,
    int PageSize = 20
) : IRequest<IReadOnlyList<VideoDto>>;
