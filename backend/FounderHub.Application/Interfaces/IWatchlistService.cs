using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Watchlists;

namespace FounderHub.Application.Interfaces
{
    public interface IWatchlistService
    {
        Task<IEnumerable<WatchlistDto>> GetMyWatchlistAsync(string userId, string role);
        Task AddToWatchlistAsync(AddToWatchlistRequest request, string userId, string role);
        Task RemoveFromWatchlistAsync(string ideaId, string userId);
    }
}
