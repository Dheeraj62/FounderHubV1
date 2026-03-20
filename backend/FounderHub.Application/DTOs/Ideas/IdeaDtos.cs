using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Ideas
{
    public class CreateIdeaRequest
    {
        [Required]
        [MinLength(3)]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(10)]
        [MaxLength(5000)]
        public string Problem { get; set; } = string.Empty;

        [Required]
        [MinLength(10)]
        [MaxLength(5000)]
        public string Solution { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Stage { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string Industry { get; set; } = string.Empty;

        // MVP-3: Pitch & demo links
        [Url]
        [MaxLength(2048)]
        public string? PitchDeckUrl { get; set; }
        
        [Url]
        [MaxLength(2048)]
        public string? DemoUrl { get; set; }
        
        [Url]
        [MaxLength(2048)]
        public string? StartupWebsite { get; set; }
        
        [MaxLength(10)]
        public List<string> ProductImages { get; set; } = new();
        
        [MaxLength(1000)]
        public string? MarketSize { get; set; }
        
        [MaxLength(1000)]
        public string? TargetCustomers { get; set; }
        
        [MaxLength(1000)]
        public string? TractionMetrics { get; set; }

        public bool PreviouslyRejected { get; set; }
        
        [MaxLength(200)]
        public string? RejectedBy { get; set; }
        
        [MaxLength(100)]
        public string? RejectionReasonCategory { get; set; }
        
        [MaxLength(5000)]
        public string? WhatChangedAfterRejection { get; set; }
        
        [MaxLength(100)]
        public string? FundingRange { get; set; }
        
        [MaxLength(200)]
        public string? Location { get; set; }
    }

    public class RecommendedIdeaDto : IdeaDto
    {
        public int MatchScore { get; set; }
        public List<string> MatchReasons { get; set; } = new();
    }

    public class TrendingIdeaDto : IdeaDto
    {
        public int TrendingScore { get; set; }
        public int ViewsLast7Days { get; set; }
        public int InterestsLast7Days { get; set; }
        public int ConnectionsLast7Days { get; set; }
    }

    public class UpdateIdeaRequest : CreateIdeaRequest
    {
    }

    public class IdeaDto : CreateIdeaRequest
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class PaginatedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
