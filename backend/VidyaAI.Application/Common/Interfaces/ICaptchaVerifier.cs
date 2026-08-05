

// Verifies a captcha token (Google reCAPTCHA / Cloudflare Turnstile compatible).
// When no secret is configured, Enabled is false and verification is skipped so
// local/dev registration still works.
public interface ICaptchaVerifier
{
    bool Enabled { get; }
    Task<bool> VerifyAsync(string? token, CancellationToken ct = default);
}