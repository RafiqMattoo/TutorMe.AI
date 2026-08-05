using System.Text.Json.Serialization;

namespace VidyaAI.Application.Videos.DTOs;

public sealed class VideoFilesDto
{
    [JsonPropertyName("large")]
    public VideoFileDto? Large { get; set; }

    [JsonPropertyName("medium")]
    public VideoFileDto? Medium { get; set; }

    [JsonPropertyName("small")]
    public VideoFileDto? Small { get; set; }

    [JsonPropertyName("tiny")]
    public VideoFileDto? Tiny { get; set; }
}