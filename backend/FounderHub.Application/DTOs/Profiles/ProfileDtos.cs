using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Profiles
{
    // ─── Founder Profile DTO (returned to client) ────────────────────────
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

        // New fields
        public string? GitHubUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? Website { get; set; }
        public string CurrentStartup { get; set; } = string.Empty;
        public string StartupStage { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public List<string> Industries { get; set; } = new();
        public List<string> LookingFor { get; set; } = new();
    }

    // ─── Upsert Founder Profile Request ──────────────────────────────────
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

        // New fields
        [Url]
        [MaxLength(2048)]
        public string? GitHubUrl { get; set; }

        [Url]
        [MaxLength(2048)]
        public string? TwitterUrl { get; set; }

        [Url]
        [MaxLength(2048)]
        public string? Website { get; set; }

        [MaxLength(200)]
        public string CurrentStartup { get; set; } = string.Empty;

        [MaxLength(100)]
        public string StartupStage { get; set; } = string.Empty;

        [MaxLength(30)]
        public List<string> Skills { get; set; } = new();

        [MaxLength(20)]
        public List<string> Industries { get; set; } = new();

        [MaxLength(10)]
        public List<string> LookingFor { get; set; } = new();
    }

    // ─── Investor Profile DTO ────────────────────────────────────────────
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
        public string? Position { get; set; }
        public string? InvestmentThesis { get; set; }
        public string? AverageTicketSize { get; set; }
        public List<string> PortfolioCompanies { get; set; } = new();
        public string? AngelListProfile { get; set; }
        public string? Website { get; set; }
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }
    }

    // ─── Upsert Investor Profile Request ─────────────────────────────────
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

        [MaxLength(200)]
        public string? Position { get; set; }

        [MaxLength(2000)]
        public string? InvestmentThesis { get; set; }

        [MaxLength(100)]
        public string? AverageTicketSize { get; set; }
        
        [MaxLength(100)]
        public List<string> PortfolioCompanies { get; set; } = new();
        
        [Url]
        [MaxLength(2048)]
        public string? AngelListProfile { get; set; }

        [Url]
        [MaxLength(2048)]
        public string? Website { get; set; }
        
        public bool LinkedInVerified { get; set; }
        
        [Url]
        [MaxLength(2048)]
        public string? LinkedInProfileUrl { get; set; }
    }

    // ─── Public Profile DTOs (aggregated for public pages) ──────────────
    public class PublicFounderProfileDto
    {
        // User-level info
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Headline { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool LinkedInVerified { get; set; }
        public bool EmailVerified { get; set; }
        public int ReputationScore { get; set; }
        public DateTime JoinedAt { get; set; }

        // Profile data
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CurrentStartup { get; set; } = string.Empty;
        public string StartupStage { get; set; } = string.Empty;
        public bool TechnicalFounder { get; set; }
        public int PreviousStartupCount { get; set; }
        public int DomainExperienceYears { get; set; }
        public int TeamSize { get; set; }
        public List<string> Skills { get; set; } = new();
        public List<string> Industries { get; set; } = new();
        public List<string> LookingFor { get; set; } = new();

        // Social links
        public string? StartupWebsite { get; set; }
        public string? GitHubUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? Website { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        // Stats (aggregated)
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public int IdeaCount { get; set; }
        public int TotalProfileViews { get; set; }
        public int TotalIdeaViews { get; set; }
        public int InvestorInterestCount { get; set; }

        // Completion
        public int ProfileCompletionPercent { get; set; }
    }

    public class PublicInvestorProfileDto
    {
        // User-level info
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Headline { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool LinkedInVerified { get; set; }
        public bool EmailVerified { get; set; }
        public int ReputationScore { get; set; }
        public DateTime JoinedAt { get; set; }

        // Profile data
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? InvestmentFirm { get; set; }
        public string? Position { get; set; }
        public string? InvestmentThesis { get; set; }
        public string? AverageTicketSize { get; set; }
        public string TicketSizeRange { get; set; } = string.Empty;
        public string InvestmentStage { get; set; } = string.Empty;
        public List<string> PreferredIndustries { get; set; } = new();
        public List<string> PreferredStages { get; set; } = new();
        public List<string> PortfolioCompanies { get; set; } = new();

        // Social links
        public string? AngelListProfile { get; set; }
        public string? Website { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        // Stats
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public int CompaniesInvested { get; set; }

        // Completion
        public int ProfileCompletionPercent { get; set; }
    }

    // ─── User Profile Update (name, headline, avatar, cover) ─────────────
    public class UpdateUserProfileRequest
    {
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Headline { get; set; } = string.Empty;
    }

    // ─── Profile Completion ──────────────────────────────────────────────
    public class ProfileCompletionDto
    {
        public int Percent { get; set; }
        public List<string> MissingFields { get; set; } = new();
    }
}
