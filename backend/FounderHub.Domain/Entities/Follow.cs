using System;

namespace FounderHub.Domain.Entities
{
    public class Follow
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FollowerId { get; set; } = string.Empty;
        public string FollowingId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // FOUNDER, INVESTOR, IDEA
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

