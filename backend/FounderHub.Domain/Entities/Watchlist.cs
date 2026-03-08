using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Domain.Entities
{
    public class Watchlist
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string InvestorId { get; set; } = string.Empty;

        [Required]
        public string IdeaId { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
