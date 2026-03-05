using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Follows
{
    public class FollowRequest
    {
        [Required]
        public string FollowingId { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // FOUNDER, INVESTOR, IDEA
    }

    public class FollowDto
    {
        public string Id { get; set; } = string.Empty;
        public string FollowerId { get; set; } = string.Empty;
        public string FollowingId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

