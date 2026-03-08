using System;

namespace FounderHub.Application.DTOs.Deals
{
    public class DealDto
    {
        public string Id { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Optional idea data for display
        public string? IdeaTitle { get; set; }
        public string? FounderName { get; set; }
    }

    public class CreateDealRequest
    {
        public string IdeaId { get; set; } = string.Empty;
        public string Stage { get; set; } = "Saved";
        public string? Notes { get; set; }
    }

    public class UpdateDealRequest
    {
        public string Stage { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
