using System;

namespace FounderHub.Domain.Entities
{
    public class IdeaView
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string IdeaId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
    }
}

