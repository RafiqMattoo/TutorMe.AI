using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Application.Videos.Queries.GetVideoById;

public sealed class GetVideoByIdHandler(
    IVideoService videoService)
    : IRequestHandler<GetVideoByIdQuery, VideoDto?>
{
    public async Task<VideoDto?> Handle(
        GetVideoByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await videoService.GetVideoByIdAsync(
            request.Id,
            cancellationToken);
    }
}
