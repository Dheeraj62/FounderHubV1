using System;

namespace FounderHub.Application.DTOs.Feed
{
    public class FeedActorDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool LinkedInVerified { get; set; }
    }

    public class FeedIdeaDto
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public string FounderUsername { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;
        public bool PreviouslyRejected { get; set; }
    }

    public class FeedUpdateDto
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public string FounderUsername { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class FeedItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public FeedActorDto Actor { get; set; } = new();

        public FeedIdeaDto? Idea { get; set; }
        public FeedUpdateDto? Update { get; set; }

        // Optional: interest status when Type == INTEREST_EVENT
        public string? InterestStatus { get; set; }
    }
}

