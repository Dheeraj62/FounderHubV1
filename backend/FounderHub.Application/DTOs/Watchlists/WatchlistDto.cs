using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Watchlists
{
    public class WatchlistDto
    {
        public string IdeaId { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Hydrated
        public string IdeaTitle { get; set; } = string.Empty;
        public string FounderName { get; set; } = string.Empty;
        public string IdeaIndustry { get; set; } = string.Empty;
        public string IdeaStage { get; set; } = string.Empty;
    }

    public class AddToWatchlistRequest
    {
        [Required]
        public string IdeaId { get; set; } = string.Empty;
        
        [MaxLength(2000)]
        public string? Notes { get; set; }
    }
}
