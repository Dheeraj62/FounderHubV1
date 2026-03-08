using System;

namespace FounderHub.Domain.Entities
{
    public class InvestorDeal
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string InvestorId { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        
        // Pipeline stages: Saved, Reviewing, Contacted, MeetingScheduled, Interested, Passed
        public string Stage { get; set; } = "Saved"; 
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
