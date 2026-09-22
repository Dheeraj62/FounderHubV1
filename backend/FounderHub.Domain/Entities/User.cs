using System;

namespace FounderHub.Domain.Entities
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Enums.UserRole Role { get; set; }

        // Profile identity
        public string FullName { get; set; } = string.Empty;
        public string Headline { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string? CoverImageUrl { get; set; }

        // Verification flags
        public bool EmailVerified { get; set; }
        public bool PhoneVerified { get; set; }
        public bool LinkedInVerified { get; set; }
        public string? LinkedInProfileUrl { get; set; }

        // Reputation
        public int ReputationScore { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
