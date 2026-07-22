﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Videos.Queries.GetVideos;

namespace VidyaAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class VideosController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(
            new GetVideosQuery(query, page, pageSize),
            cancellationToken);

        return Ok(result);
    }
}