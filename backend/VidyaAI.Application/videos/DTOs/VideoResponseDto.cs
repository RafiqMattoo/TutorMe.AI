using System.Text.Json.Serialization;

namespace VidyaAI.Application.Videos.DTOs;

public sealed class VideoResponseDto
{
    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("totalHits")]
    public int TotalHits { get; set; }

    [JsonPropertyName("hits")]
    public List<VideoItemDto> Hits { get; set; } = [];
}