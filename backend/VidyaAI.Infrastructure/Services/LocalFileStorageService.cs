using Microsoft.Extensions.Configuration;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Stores files on local disk under {Storage:Root}/uploads/{yyyy}/{MM}/{guid}-{name}.
// Returned URL is a relative path served by the static file middleware.
public sealed class LocalFileStorageService(IConfiguration cfg) : IStorageService
{
    private readonly string _root = string.IsNullOrWhiteSpace(cfg["Storage:Root"])
        ? Path.Combine(AppContext.BaseDirectory, "storage")
        : cfg["Storage:Root"]!;
    private readonly string _publicPathPrefix = string.IsNullOrWhiteSpace(cfg["Storage:PublicPath"])
        ? "/files" : cfg["Storage:PublicPath"]!;

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        var safeName = Path.GetFileName(fileName);
        var now = DateTime.UtcNow;
        var subdir = Path.Combine("uploads", now.Year.ToString(), now.Month.ToString("D2"));
        var fullDir = Path.Combine(_root, subdir);
        Directory.CreateDirectory(fullDir);

        var stored = $"{Guid.NewGuid():N}-{safeName}";
        var fullPath = Path.Combine(fullDir, stored);

        await using var fs = File.Create(fullPath);
        await stream.CopyToAsync(fs, ct);

        return $"{_publicPathPrefix}/{subdir.Replace('\\', '/')}/{stored}";
    }

    public Task DeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(fileUrl) || !fileUrl.StartsWith(_publicPathPrefix))
            return Task.CompletedTask;

        var rel = fileUrl[_publicPathPrefix.Length..].TrimStart('/');
        var full = Path.Combine(_root, rel.Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(full)) File.Delete(full);
        return Task.CompletedTask;
    }

    public string AbsolutePathFor(string fileUrl)
    {
        var rel = fileUrl.StartsWith(_publicPathPrefix)
            ? fileUrl[_publicPathPrefix.Length..].TrimStart('/')
            : fileUrl;
        return Path.Combine(_root, rel.Replace('/', Path.DirectorySeparatorChar));
    }
}
