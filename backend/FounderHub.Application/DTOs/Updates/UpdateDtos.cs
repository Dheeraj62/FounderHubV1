using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Updates
{
    public class CreateFounderUpdateRequest
    {
        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;
    }

    public class FounderUpdateDto
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

