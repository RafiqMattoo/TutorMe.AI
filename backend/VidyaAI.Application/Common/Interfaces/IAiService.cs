// AI summarisation
public interface IAiService
{
    Task<string> SummariseAsync(string text, CancellationToken ct = default);
}