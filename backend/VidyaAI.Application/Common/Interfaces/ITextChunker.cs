public sealed record TextChunk(string Content, int Index, int? PageNumber, int TokenCount);

public interface ITextChunker
{
    IReadOnlyList<TextChunk> Chunk(IEnumerable<PdfText> pages);
}