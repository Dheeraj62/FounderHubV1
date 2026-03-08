using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Domain.Entities
{
    public class InvestorFeedback
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string IdeaId { get; set; } = string.Empty;

        [Required]
        public string InvestorId { get; set; } = string.Empty;

        // Rating from 1-5
        public int OverallRating { get; set; }

        // Structured feedback by category
        public int MarketPotentialScore { get; set; }  // 1-5
        public int TeamScore { get; set; }             // 1-5
        public int TractionScore { get; set; }         // 1-5
        public int UniqueValueScore { get; set; }      // 1-5

        public string? Comments { get; set; }
        public string? Strengths { get; set; }
        public string? Improvements { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
