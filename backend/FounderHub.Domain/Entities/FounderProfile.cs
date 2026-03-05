using System;

namespace FounderHub.Domain.Entities
{
    public class FounderProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
