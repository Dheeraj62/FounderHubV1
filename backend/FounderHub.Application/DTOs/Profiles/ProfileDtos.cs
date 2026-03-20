using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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
        public string? LinkedInProfileUrl { get; set; }
        public string? StartupWebsite { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }

    public class UpsertFounderProfileRequest
    {
        [Required]
        public bool TechnicalFounder { get; set; }
        public int PreviousStartupCount { get; set; }
        public int DomainExperienceYears { get; set; }
        public int TeamSize { get; set; }
        public bool LinkedInVerified { get; set; }
        [Url]
        [MaxLength(2048)]
        public string? LinkedInProfileUrl { get; set; }
        
        [Url]
        [MaxLength(2048)]
        public string? StartupWebsite { get; set; }
        
        [Required]
        [MaxLength(2000)]
        public string Bio { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;
    }

    public class InvestorProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public List<string> PreferredIndustries { get; set; } = new();
        public List<string> PreferredStages { get; set; } = new();
        public string PreferredFundingRange { get; set; } = string.Empty;
        public string PreferredLocation { get; set; } = string.Empty;
        public string PreferredTeamSize { get; set; } = string.Empty;
        public string InvestmentStage { get; set; } = string.Empty;
        public string TicketSizeRange { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        public string? InvestmentFirm { get; set; }
        public List<string> PortfolioCompanies { get; set; } = new();
        public string? AngelListProfile { get; set; }
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }
    }

    public class UpsertInvestorProfileRequest
    {
        [MaxLength(50)]
        public List<string> PreferredIndustries { get; set; } = new();
        
        [MaxLength(20)]
        public List<string> PreferredStages { get; set; } = new();
        
        [Required]
        [MaxLength(100)]
        public string PreferredFundingRange { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string PreferredLocation { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string PreferredTeamSize { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string InvestmentStage { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string TicketSizeRange { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Bio { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? InvestmentFirm { get; set; }
        
        [MaxLength(100)]
        public List<string> PortfolioCompanies { get; set; } = new();
        
        [Url]
        [MaxLength(2048)]
        public string? AngelListProfile { get; set; }
        
        public bool LinkedInVerified { get; set; }
        
        [Url]
        [MaxLength(2048)]
        public string? LinkedInProfileUrl { get; set; }
    }
}
