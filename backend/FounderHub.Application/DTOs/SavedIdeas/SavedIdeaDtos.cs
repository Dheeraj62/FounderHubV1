using System;

namespace FounderHub.Application.DTOs.SavedIdeas
{
    public class SavedIdeaDto
    {
        public string Id { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        public DateTime SavedAt { get; set; }
    }
}
