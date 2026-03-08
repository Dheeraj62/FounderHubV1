using System;

namespace FounderHub.Domain.Entities
{
    public class Idea
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FounderId { get; set; } = string.Empty;
        
        public string Title { get; set; } = string.Empty;
        public string Problem { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty; // Idea / MVP / EarlyRevenue
        public string Industry { get; set; } = string.Empty;

        // MVP-3: Pitch & demo links
        public string? PitchDeckUrl { get; set; }
        public string? DemoUrl { get; set; }
        public string? StartupWebsite { get; set; }
        public List<string> ProductImages { get; set; } = new();
        public string? MarketSize { get; set; }
        public string? TargetCustomers { get; set; }
        public string? TractionMetrics { get; set; }
        
        public bool PreviouslyRejected { get; set; }
        public string? RejectedBy { get; set; }
        public string? RejectionReasonCategory { get; set; }
        public string? WhatChangedAfterRejection { get; set; }
        
        public string? FundingRange { get; set; }
        public string? Location { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
