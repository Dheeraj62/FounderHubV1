using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;

namespace FounderHub.Application.Interfaces
{
    public interface ISmartMatchService
    {
        Task<PaginatedResult<RecommendedIdeaDto>> GetSmartMatchesAsync(string userId, int page = 1, int pageSize = 20);
    }
}
