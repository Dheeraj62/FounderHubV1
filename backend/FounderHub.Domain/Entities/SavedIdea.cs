using System;

namespace FounderHub.Domain.Entities
{
    public class SavedIdea
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string InvestorId { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
}
