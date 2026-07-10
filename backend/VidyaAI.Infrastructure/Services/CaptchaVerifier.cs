using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VidyaAI.Application.Common.Interfaces;

namespace VidyaAI.Infrastructure.Services;

// Verifies a captcha token server-side. Works with Google reCAPTCHA and Cloudflare
// Turnstile (both expose a /siteverify endpoint that takes secret + response and
// returns { "success": bool }). Disabled (and skipped) when no secret is set, so
// local/dev registration works without keys.
public sealed class CaptchaVerifier(HttpClient http, IConfiguration cfg, ILogger<CaptchaVerifier> log) : ICaptchaVerifier
{
    private readonly string? _secret = cfg["Captcha:SecretKey"];
    private readonly string _verifyUrl = string.IsNullOrWhiteSpace(cfg["Captcha:VerifyUrl"])
        ? "https://www.google.com/recaptcha/api/siteverify" : cfg["Captcha:VerifyUrl"]!;

    public bool Enabled => !string.IsNullOrWhiteSpace(_secret);

    public async Task<bool> VerifyAsync(string? token, CancellationToken ct = default)
    {
        if (!Enabled) return true;                      // not configured → accept
        if (string.IsNullOrWhiteSpace(token)) return false;

        try
        {
            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["secret"] = _secret!,
                ["response"] = token,
            });
            using var res = await http.PostAsync(_verifyUrl, content, ct);
            if (!res.IsSuccessStatusCode) return false;

            await using var stream = await res.Content.ReadAsStreamAsync(ct);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
            return doc.RootElement.TryGetProperty("success", out var ok) && ok.GetBoolean();
        }
        catch (Exception ex)
        {
            log.LogWarning(ex, "Captcha verification call failed.");
            return false;
        }
    }
}
