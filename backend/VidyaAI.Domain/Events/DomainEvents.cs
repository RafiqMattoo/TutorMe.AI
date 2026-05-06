namespace VidyaAI.Domain.Events;

public abstract record DomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

// Article events
public record ArticlePublishedEvent(Guid ArticleId, string Title, Guid AuthorId) : DomainEvent;
public record ArticleDeletedEvent(Guid ArticleId, Guid AuthorId) : DomainEvent;

// User events
public record UserCreatedEvent(Guid UserId, string Email, string Role) : DomainEvent;
public record UserDeactivatedEvent(Guid UserId, string Email) : DomainEvent;

// Comment events
public record CommentLikedEvent(Guid CommentId, Guid LikedByUserId, Guid CommentAuthorId) : DomainEvent;

// School events
public record SchoolCreatedEvent(Guid SchoolId, string Name, string Plan) : DomainEvent;
