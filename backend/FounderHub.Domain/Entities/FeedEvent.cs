using System;

namespace FounderHub.Domain.Entities
{
    public class FeedEvent
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; } = string.Empty; // IDEA_CREATED, IDEA_UPDATED, FOUNDER_UPDATE, INTEREST_EVENT, NEW_FOUNDER, TRENDING_IDEA
        public string UserId { get; set; } = string.Empty; // actor
        public string? ReferenceId { get; set; } // ideaId, updateId, etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

