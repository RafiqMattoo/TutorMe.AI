using System.Text;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Simple sliding-window chunker: ~targetTokens per chunk with ~overlap tokens of overlap.
// "Token" is approximated as words / 0.75 (rough rule of thumb for English).
public sealed class TextChunker : ITextChunker
{
    private const int TargetTokens = 500;
    private const int OverlapTokens = 60;

    public IReadOnlyList<TextChunk> Chunk(IEnumerable<PdfText> pages)
    {
        var chunks = new List<TextChunk>();
        var index = 0;

        foreach (var page in pages)
        {
            var words = page.Text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var targetWords = (int)(TargetTokens * 0.75);
            var overlapWords = (int)(OverlapTokens * 0.75);
            var step = Math.Max(1, targetWords - overlapWords);

            for (var start = 0; start < words.Length; start += step)
            {
                var take = Math.Min(targetWords, words.Length - start);
                if (take <= 0) break;

                var sb = new StringBuilder();
                for (var i = 0; i < take; i++)
                {
                    if (i > 0) sb.Append(' ');
                    sb.Append(words[start + i]);
                }

                var content = sb.ToString();
                chunks.Add(new TextChunk(content, index++, page.PageNumber, EstimateTokens(take)));

                if (start + take >= words.Length) break;
            }
        }

        return chunks;
    }

    private static int EstimateTokens(int wordCount) => (int)Math.Ceiling(wordCount / 0.75);
}
