using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Application.Videos.Queries.GetVideoById;

public sealed record GetVideoByIdQuery(
    long Id
) : IRequest<VideoDto?>;