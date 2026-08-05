// Email service abstraction
public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default);
    Task SendCommentLikedNotificationAsync(string to, string commenterName, string articleTitle, CancellationToken ct = default);
    Task SendWelcomeEmailAsync(string to, string name, CancellationToken ct = default);
}