﻿namespace VidyaAI.Application.Videos.DTOs;

public record VideoDto(
    long Id,
    string Tags,
    string VideoUrl,
    string ThumbnailUrl,
    int Width,
    int Height,
    int Duration,
    int Views,
    int Downloads,
    int Likes,
    string User,
    string UserImageUrl
);