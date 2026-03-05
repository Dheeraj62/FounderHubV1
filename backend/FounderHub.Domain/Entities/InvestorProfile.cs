using System;
using System.Collections.Generic;

namespace FounderHub.Domain.Entities
{
    public class InvestorProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;

        public List<string> PreferredIndustries { get; set; } = new();
        public string InvestmentStage { get; set; } = string.Empty; // Idea / MVP / EarlyRevenue
        public string TicketSizeRange { get; set; } = string.Empty; // e.g. "$10K-$50K"
        public string Location { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        // MVP-3: Investor verification signals
        public string? InvestmentFirm { get; set; }
        public List<string> PortfolioCompanies { get; set; } = new();
        public string? AngelListProfile { get; set; }
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
