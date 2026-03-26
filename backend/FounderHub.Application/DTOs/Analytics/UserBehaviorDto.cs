using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Analytics
{
    public class TrackBehaviorRequest
    {
        [Required]
        public string IdeaId { get; set; } = string.Empty;

        /// <summary>
        /// One of: IdeaClick, TimeSpent, InterestAction, MessageInitiated, WatchlistAdd
        /// </summary>
        [Required]
        public string ActionType { get; set; } = string.Empty;

        /// <summary>
        /// Optional: seconds spent on page for TimeSpent events
        /// </summary>
        public int? DurationSeconds { get; set; }
    }
}
