using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class WatchlistRepository : IWatchlistRepository
    {
        private readonly MongoDbContext _context;

        public WatchlistRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Watchlist>> GetByInvestorIdAsync(string investorId)
        {
            return await _context.Watchlists.Find(w => w.InvestorId == investorId).ToListAsync();
        }

        public async Task<Watchlist?> GetAsync(string investorId, string ideaId)
        {
            return await _context.Watchlists
                .Find(w => w.InvestorId == investorId && w.IdeaId == ideaId)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Watchlist watchlist)
        {
            await _context.Watchlists.InsertOneAsync(watchlist);
        }

        public async Task<bool> DeleteAsync(string investorId, string ideaId)
        {
            var result = await _context.Watchlists.DeleteOneAsync(w => w.InvestorId == investorId && w.IdeaId == ideaId);
            return result.DeletedCount > 0;
        }
    }
}
