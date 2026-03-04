using System;

namespace FounderHub.Domain.Entities
{
    public class Notification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // ConnectionRequest / ConnectionAccepted / NewInterest / NewMessage
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string? ReferenceId { get; set; } // ConnectionId, IdeaId, etc.
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
