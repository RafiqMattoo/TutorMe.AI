using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Sends HTML email over SMTP when configured (Smtp:Host). When SMTP is NOT
// configured (local/dev), it falls back to writing the rendered email to
// {Storage:Root}/emails/*.html and logging it — so registration still works and
// you can preview the templates without a mail server.
public sealed class SmtpEmailService(IConfiguration cfg, ILogger<SmtpEmailService> log) : IEmailService
{
    private readonly string? _host = cfg["Smtp:Host"];
    private readonly int _port = int.TryParse(cfg["Smtp:Port"], out var p) ? p : 587;
    private readonly string? _user = cfg["Smtp:User"];
    private readonly string? _password = cfg["Smtp:Password"];
    private readonly bool _ssl = !bool.TryParse(cfg["Smtp:EnableSsl"], out var s) || s;
    private readonly string _fromAddress = cfg["Smtp:From"] ?? "no-reply@vidyaai.local";
    private readonly string _fromName = cfg["Smtp:FromName"] ?? "VidyaAI";
    private readonly string _storageRoot = string.IsNullOrWhiteSpace(cfg["Storage:Root"])
        ? Path.Combine(AppContext.BaseDirectory, "storage") : cfg["Storage:Root"]!;

    private bool Configured => !string.IsNullOrWhiteSpace(_host);

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(to)) return;

        if (!Configured)
        {
            await SavePreviewAsync(to, subject, htmlBody, ct);
            return;
        }

        try
        {
            using var msg = new MailMessage
            {
                From = new MailAddress(_fromAddress, _fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
            };
            msg.To.Add(to);

            using var client = new SmtpClient(_host, _port) { EnableSsl = _ssl };
            if (!string.IsNullOrEmpty(_user))
                client.Credentials = new NetworkCredential(_user, _password);

            await client.SendMailAsync(msg, ct);
            log.LogInformation("Email sent to {To}: {Subject}", to, subject);
        }
        catch (Exception ex)
        {
            // Never let a mail failure break the calling flow (e.g. registration).
            log.LogError(ex, "Failed to send email to {To}; saving a local preview instead.", to);
            await SavePreviewAsync(to, subject, htmlBody, ct);
        }
    }

    // Dev fallback: persist the rendered HTML so the templates can be previewed.
    private async Task SavePreviewAsync(string to, string subject, string htmlBody, CancellationToken ct)
    {
        try
        {
            var dir = Path.Combine(_storageRoot, "emails");
            Directory.CreateDirectory(dir);
            var safe = string.Join("_", to.Split(Path.GetInvalidFileNameChars()));
            var file = Path.Combine(dir, $"{DateTime.UtcNow:yyyyMMdd-HHmmss}-{safe}.html");
            await File.WriteAllTextAsync(file, htmlBody, ct);
            log.LogInformation("[Email preview] To: {To} | Subject: {Subject} | Saved: {File}", to, subject, file);
        }
        catch (Exception ex)
        {
            log.LogWarning(ex, "Could not save email preview for {To}", to);
        }
    }

    public Task SendWelcomeEmailAsync(string to, string name, CancellationToken ct = default)
    {
        var (subject, html) = EmailTemplates.Approved(name, "Your account", "/login");
        return SendAsync(to, subject, html, ct);
    }

    public Task SendCommentLikedNotificationAsync(string to, string commenterName, string articleTitle, CancellationToken ct = default)
        => SendAsync(to, "Someone liked your comment — VidyaAI",
            $"<p>{System.Net.WebUtility.HtmlEncode(commenterName)} liked your comment on \"{System.Net.WebUtility.HtmlEncode(articleTitle)}\".</p>", ct);
}
