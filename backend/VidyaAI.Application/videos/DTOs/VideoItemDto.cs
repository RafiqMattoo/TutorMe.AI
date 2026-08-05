using System.Text.Json.Serialization;

namespace VidyaAI.Application.Videos.DTOs;

public sealed class VideoItemDto
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("pageURL")]
    public string PageUrl { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("tags")]
    public string Tags { get; set; } = string.Empty;

    [JsonPropertyName("duration")]
    public int Duration { get; set; }

    [JsonPropertyName("picture_id")]
    public string PictureId { get; set; } = string.Empty;

    [JsonPropertyName("views")]
    public int Views { get; set; }

    [JsonPropertyName("downloads")]
    public int Downloads { get; set; }

    [JsonPropertyName("likes")]
    public int Likes { get; set; }

    [JsonPropertyName("comments")]
    public int Comments { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("user")]
    public string User { get; set; } = string.Empty;

    [JsonPropertyName("userImageURL")]
    public string UserImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("videos")]
    public VideoFilesDto Videos { get; set; } = new();
}