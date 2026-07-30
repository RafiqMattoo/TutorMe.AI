using System.Net;

namespace VidyaAI.Application.Common;

// Responsive, email-client-safe HTML templates (table layout + inline styles) for
// registration and approval messages. Lives in Application so both handlers and the
// email service can build them. Each builder returns (subject, htmlBody).
public static class EmailTemplates
{
  private const string Brand = "#2563eb";
  private const string Ink = "#0f172a";
  private const string Muted = "#64748b";

  public static (string Subject, string Html) SchoolRegistrationReceived(string adminName, string schoolName)
  {
    var body = $"""
            {Greeting(adminName)}
            <p style="{P}">Thanks for registering <strong>{Esc(schoolName)}</strong> on VidyaAI.</p>
            {Callout("⏳", "Pending approval", "Your school is now in the review queue. A platform administrator will approve it shortly — you'll get an email the moment it's ready, and then you can sign in as the school admin.")}
            <p style="{P}">While you wait, there's nothing else you need to do.</p>
            """;
    return ("Your school registration is being reviewed — VidyaAI",
        Layout("School registration received", "We've received your school registration.", body));
  }

  public static (string Subject, string Html) MemberRegistrationReceived(string name, string role, string schoolName)
  {
    var r = role.ToLowerInvariant();
    var body = $"""
            {Greeting(name)}
            <p style="{P}">Your request to join <strong>{Esc(schoolName)}</strong> as a <strong>{Esc(r)}</strong> has been received.</p>
            {Callout("⏳", "Pending approval", $"A school admin at {Esc(schoolName)} will review your request. As soon as it's approved you'll get a confirmation email and can sign in.")}
            """;
    return ($"Your {r} registration is being reviewed — VidyaAI",
        Layout("Registration received", "We've received your registration.", body));
  }

  public static (string Subject, string Html) Approved(string name, string what, string signInUrl)
  {
    var body = $"""
            {Greeting(name)}
            {Callout("✅", "You're approved!", $"{Esc(what)} has been approved. You can now sign in and get started.")}
            <p style="text-align:center;margin:28px 0 8px;">
              <a href="{Esc(signInUrl)}" style="display:inline-block;background:{Brand};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 26px;border-radius:10px;">Sign in to VidyaAI</a>
            </p>
            """;
    return ("You're approved — welcome to VidyaAI", Layout("Approved", "Your account is approved.", body));
  }

  public static (string Subject, string Html) Rejected(string name, string what)
  {
    var body = $"""
            {Greeting(name)}
            {Callout("ℹ️", "Registration not approved", $"Unfortunately {Esc(what)} was not approved at this time. If you think this was a mistake, please contact your administrator.")}
            """;
    return ("Update on your VidyaAI registration", Layout("Registration update", "An update on your registration.", body));
  }

  // ── PASSWORD RESET ─────────────────────────────────────────────
  public static (string Subject, string Html) PasswordReset(
  string name,
  string token)
  {
    var body = $"""
        {Greeting(name)}

        <p style="{P}">
            We received a request to reset your VidyaAI password.
        </p>

        {Callout(
            "🔐",
            "Password Reset",
            $"Use this reset token to reset your password: {token}. This token expires in 1 hour.")}

        <p style="{P}">
            If you didn't request this password reset, you can safely ignore this email.
        </p>
        """;

    return (
        "Reset your VidyaAI password",
        Layout(
            "Password Reset",
            "Use this token to reset your password.",
            body));
  }

  // ── Shared layout ─────────────────────────────────────────────
  private static string Greeting(string name) =>
      $"""<p style="{P}">Hi {Esc(string.IsNullOrWhiteSpace(name) ? "there" : name.Split(' ')[0])},</p>""";

  private const string P = "margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;";

  private static string Callout(string emoji, string title, string text) => $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
          <tr><td style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;">
            <div style="font-size:14px;font-weight:700;color:{Ink};margin-bottom:4px;">{emoji}&nbsp; {Esc(title)}</div>
            <div style="font-size:13.5px;line-height:1.6;color:{Muted};">{Esc(text)}</div>
          </td></tr>
        </table>
        """;

  private static string Layout(string heading, string preheader, string bodyHtml) => $"""
        <!DOCTYPE html>
        <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>{Esc(heading)}</title></head>
        <body style="margin:0;padding:0;background:#eef2f7;">
          <span style="display:none;max-height:0;overflow:hidden;opacity:0;">{Esc(preheader)}</span>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px;">
            <tr><td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
                <tr><td style="background:linear-gradient(135deg,#1e3a8a 0%,{Brand} 100%);padding:26px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td style="width:40px;vertical-align:middle;">
                      <div style="width:38px;height:38px;background:rgba(255,255,255,0.18);border-radius:10px;text-align:center;line-height:38px;font-size:20px;">🎓</div>
                    </td>
                    <td style="padding-left:12px;vertical-align:middle;">
                      <div style="color:#ffffff;font-size:17px;font-weight:800;letter-spacing:-0.2px;">VidyaAI</div>
                      <div style="color:rgba(255,255,255,0.6);font-size:11px;">Learning Platform</div>
                    </td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:30px 32px 8px;">
                  <h1 style="margin:0 0 18px;font-size:21px;font-weight:800;color:{Ink};">{Esc(heading)}</h1>
                  {bodyHtml}
                </td></tr>
                <tr><td style="padding:20px 32px 28px;border-top:1px solid #eef2f7;">
                  <div style="font-size:12px;line-height:1.6;color:#94a3b8;">
                    You're receiving this because you registered on VidyaAI. If this wasn't you, you can ignore this email.
                  </div>
                </td></tr>
              </table>
              <div style="font-size:11px;color:#94a3b8;margin-top:14px;">© VidyaAI · Learning Platform</div>
            </td></tr>
          </table>
        </body></html>
        """;

  private static string Esc(string? s) => WebUtility.HtmlEncode(s ?? string.Empty);
}
