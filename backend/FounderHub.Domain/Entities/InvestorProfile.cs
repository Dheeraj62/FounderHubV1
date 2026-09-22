using System;
using System.Collections.Generic;

namespace FounderHub.Domain.Entities
{
    public class InvestorProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;

        // Investment preferences
        public List<string> PreferredIndustries { get; set; } = new();
        public List<string> PreferredStages { get; set; } = new();
        public string PreferredFundingRange { get; set; } = string.Empty;
        public string PreferredLocation { get; set; } = string.Empty;
        public string PreferredTeamSize { get; set; } = string.Empty;
        public string InvestmentStage { get; set; } = string.Empty;
        public string TicketSizeRange { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        // Firm & portfolio
        public string? InvestmentFirm { get; set; }
        public string? Position { get; set; }
        public string? InvestmentThesis { get; set; }
        public string? AverageTicketSize { get; set; }
        public List<string> PortfolioCompanies { get; set; } = new();

        // Social & web presence
        public string? AngelListProfile { get; set; }
        public string? Website { get; set; }
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
