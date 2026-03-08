using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Meetings
{
    public class RequestMeetingDto
    {
        [Required]
        public string FounderId { get; set; } = string.Empty;
        public string? IdeaId { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        public string Platform { get; set; } = "Video Call";
        public string? MeetingLink { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateMeetingStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Confirmed | Declined
    }

    public class MeetingDto
    {
        public string Id { get; set; } = string.Empty;
        public string RequestedByInvestorId { get; set; } = string.Empty;
        public string InvestorName { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public string FounderName { get; set; } = string.Empty;
        public string? IdeaId { get; set; }
        public string? IdeaTitle { get; set; }
        public DateTime ScheduledAt { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string? MeetingLink { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
