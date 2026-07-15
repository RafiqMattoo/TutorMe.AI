public sealed record PdfText(string Text, int PageNumber);

public interface IPdfTextExtractor
{
    IEnumerable<PdfText> Extract(Stream pdfStream);
}