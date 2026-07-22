using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.Videos.DTOs;

namespace VidyaAI.Infrastructure.Services;

public sealed class VideoService(
    HttpClient http,
    IConfiguration configuration,
    ILogger<VideoService> logger)
    : IVideoService
{
    private readonly string _baseUrl =
        configuration["Pixabay:BaseUrl"]
        ?? throw new InvalidOperationException("Pixabay:BaseUrl missing.");

    private readonly string _apiKey =
        configuration["Pixabay:ApiKey"]
        ?? throw new InvalidOperationException("Pixabay:ApiKey missing.");

    public async Task<IReadOnlyList<VideoDto>> GetVideosAsync(
        string? query,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        query ??= "";

        var url =
            $"{_baseUrl}" +
            $"?key={_apiKey}" +
            $"&q={Uri.EscapeDataString(query)}" +
            $"&page={page}" +
            $"&per_page={pageSize}";

        logger.LogInformation("Calling Pixabay API : {Url}", url);

        var response = await http.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);

            logger.LogError(
                "Pixabay API Error : {StatusCode} {Error}",
                response.StatusCode,
                error);

            throw new InvalidOperationException("Unable to fetch videos from Pixabay.");
        }

        var result = await response.Content.ReadFromJsonAsync<VideoResponseDto>(
            cancellationToken: cancellationToken);

        if (result is null || result.Hits.Count == 0)
            return [];

        return result.Hits.Select(video =>
{
    var file =
        video.Videos.Large ??
        video.Videos.Medium ??
        video.Videos.Small ??
        video.Videos.Tiny;

    return new VideoDto(
        video.Id,
        video.Tags,
        file?.Url ?? string.Empty,
        file?.Thumbnail ?? string.Empty,
        file?.Width ?? 0,
        file?.Height ?? 0,
        video.Duration,
        video.Views,
        video.Downloads,
        video.Likes,
        video.User,
        video.UserImageUrl
    );
}).ToList();
    }
}