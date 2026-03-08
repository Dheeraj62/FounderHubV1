using System;
using System.Collections.Generic;

namespace FounderHub.Application.DTOs.Feedback
{
    public class SubmitFeedbackRequest
    {
        public string IdeaId { get; set; } = string.Empty;

        // Ratings 1-5
        public int OverallRating { get; set; }
        public int MarketPotentialScore { get; set; }
        public int TeamScore { get; set; }
        public int TractionScore { get; set; }
        public int UniqueValueScore { get; set; }

        public string? Comments { get; set; }
        public string? Strengths { get; set; }
        public string? Improvements { get; set; }
    }

    public class FeedbackDto
    {
        public string Id { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public string InvestorName { get; set; } = string.Empty;
        public int OverallRating { get; set; }
        public int MarketPotentialScore { get; set; }
        public int TeamScore { get; set; }
        public int TractionScore { get; set; }
        public int UniqueValueScore { get; set; }
        public string? Comments { get; set; }
        public string? Strengths { get; set; }
        public string? Improvements { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
