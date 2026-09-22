using System;

namespace FounderHub.Domain.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record IdeaCreatedEvent(string IdeaId, string FounderId, string Title, DateTime OccurredAt) : IDomainEvent;
public record IdeaUpdatedEvent(string IdeaId, string FounderId, DateTime OccurredAt) : IDomainEvent;
public record InterestExpressedEvent(string InterestId, string IdeaId, string InvestorId, string Status, string FounderId, string IdeaTitle, DateTime OccurredAt) : IDomainEvent;
public record FounderRegisteredEvent(string UserId, DateTime OccurredAt) : IDomainEvent;
public record MessageSentEvent(string ConnectionId, string SenderId, string ReceiverId, string Content, DateTime OccurredAt) : IDomainEvent;
