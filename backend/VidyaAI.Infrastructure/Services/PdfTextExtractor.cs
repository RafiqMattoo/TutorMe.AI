using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.WordExtractor;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

public sealed class PdfTextExtractor : IPdfTextExtractor
{
    public IEnumerable<PdfText> Extract(Stream pdfStream)
    {
        using var doc = PdfDocument.Open(pdfStream);
        foreach (var page in doc.GetPages())
        {
            var words = NearestNeighbourWordExtractor.Instance.GetWords(page.Letters);
            var text = string.Join(' ', words.Select(w => w.Text));
            if (!string.IsNullOrWhiteSpace(text))
                yield return new PdfText(text, page.Number);
        }
    }
}
