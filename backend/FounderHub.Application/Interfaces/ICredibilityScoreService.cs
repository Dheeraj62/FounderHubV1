using System.Threading.Tasks;

namespace FounderHub.Application.Interfaces
{
    public class CredibilityScoreDto
    {
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public string Badge { get; set; } = string.Empty;
        public int ProfileScore { get; set; }
        public int IdeaScore { get; set; }
        public int EngagementScore { get; set; }
        public int TotalIdeas { get; set; }
        public int TotalViews { get; set; }
    }

    public interface ICredibilityScoreService
    {
        Task<CredibilityScoreDto> ComputeAsync(string founderId);
    }
}
