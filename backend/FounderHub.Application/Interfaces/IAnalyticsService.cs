using System.Threading.Tasks;
using FounderHub.Application.DTOs.Analytics;

namespace FounderHub.Application.Interfaces
{
    public interface IAnalyticsService
    {
        Task<FounderAnalyticsSummaryDto> GetFounderAnalyticsAsync(string founderId);
    }
}
