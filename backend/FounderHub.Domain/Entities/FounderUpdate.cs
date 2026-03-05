using System;

namespace FounderHub.Domain.Entities
{
    public class FounderUpdate
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FounderId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

