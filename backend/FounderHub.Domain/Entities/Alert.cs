using System;

namespace FounderHub.Domain.Entities
{
    /// <summary>
    /// In-app alert for an investor triggered by system events:
    /// new high-match startups, traction spikes, idea updates, etc.
    /// </summary>
    public class Alert
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;

        /// <summary>
        /// One of: NewMatch | TractionSpike | IdeaUpdated | NewMessage
        /// </summary>
        public string AlertType { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Optional: idea or entity triggering this alert.
        /// </summary>
        public string? RelatedIdeaId { get; set; }

        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
