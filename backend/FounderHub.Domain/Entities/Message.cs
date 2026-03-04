using System;

namespace FounderHub.Domain.Entities
{
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ConnectionId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string RecipientId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
