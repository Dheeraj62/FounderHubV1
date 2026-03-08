using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Domain.Entities
{
    public class Meeting
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string RequestedByInvestorId { get; set; } = string.Empty;

        [Required]
        public string FounderId { get; set; } = string.Empty;

        public string? IdeaId { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        public string Platform { get; set; } = "Video Call"; // Zoom, Meet, etc.
        public string? MeetingLink { get; set; }
        public string? Notes { get; set; }

        // Pending | Confirmed | Declined | Completed
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
