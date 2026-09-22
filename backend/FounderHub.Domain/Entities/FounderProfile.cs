using System;
using System.Collections.Generic;

namespace FounderHub.Domain.Entities
{
    public class FounderProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;

        // Experience & credentials
        public bool TechnicalFounder { get; set; }
        public int PreviousStartupCount { get; set; }
        public int DomainExperienceYears { get; set; }
        public int TeamSize { get; set; }

        // Verification (legacy fields kept for compatibility)
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        // Bio & location
        public string Bio { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        // Social & web presence
        public string? StartupWebsite { get; set; }
        public string? GitHubUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? Website { get; set; }

        // Professional context
        public string CurrentStartup { get; set; } = string.Empty;
        public string StartupStage { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public List<string> Industries { get; set; } = new();
        public List<string> LookingFor { get; set; } = new(); // Investors, Co-founder, Mentor, Employees

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
