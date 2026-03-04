using System;

namespace FounderHub.Domain.Entities
{
    public class Connection
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FounderId { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending / Accepted / Rejected
        public string InitiatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
