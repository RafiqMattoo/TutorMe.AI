using System.Text.Json.Serialization;

namespace VidyaAI.Application.Videos.DTOs;

public sealed class VideoFileDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("width")]
    public int Width { get; set; }

    [JsonPropertyName("height")]
    public int Height { get; set; }

    [JsonPropertyName("size")]
    public int Size { get; set; }

    [JsonPropertyName("thumbnail")]
    public string Thumbnail { get; set; } = string.Empty;
}