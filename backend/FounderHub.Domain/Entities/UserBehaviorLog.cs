using System;

namespace FounderHub.Domain.Entities
{
    /// <summary>
    /// Tracks every meaningful interaction an investor has with a startup idea.
    /// Used to improve AI match rankings over time via behavior signals.
    /// </summary>
    public class UserBehaviorLog
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;

        /// <summary>
        /// One of: IdeaClick | TimeSpent | InterestAction | MessageInitiated | WatchlistAdd
        /// </summary>
        public string ActionType { get; set; } = string.Empty;

        /// <summary>
        /// For TimeSpent events: seconds spent on the idea page.
        /// </summary>
        public int? DurationSeconds { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
