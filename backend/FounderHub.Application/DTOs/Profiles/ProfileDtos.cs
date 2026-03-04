using System.Collections.Generic;

namespace FounderHub.Application.DTOs.Profiles
{
    public class FounderProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public bool TechnicalFounder { get; set; }
        public int PreviousStartupCount { get; set; }
        public int DomainExperienceYears { get; set; }
        public int TeamSize { get; set; }
        public bool LinkedInVerified { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }

    public class UpsertFounderProfileRequest
    {
        public bool TechnicalFounder { get; set; }
        public int PreviousStartupCount { get; set; }
        public int DomainExperienceYears { get; set; }
        public int TeamSize { get; set; }
        public bool LinkedInVerified { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }

    public class InvestorProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public List<string> PreferredIndustries { get; set; } = new();
        public string InvestmentStage { get; set; } = string.Empty;
        public string TicketSizeRange { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
    }

    public class UpsertInvestorProfileRequest
    {
        public List<string> PreferredIndustries { get; set; } = new();
        public string InvestmentStage { get; set; } = string.Empty;
        public string TicketSizeRange { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
    }
}
