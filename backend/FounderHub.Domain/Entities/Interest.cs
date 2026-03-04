using System;

namespace FounderHub.Domain.Entities
{
    public class Interest
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string IdeaId { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public Enums.InterestStatus Status { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
