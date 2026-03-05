using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class FounderUpdateRepository : IFounderUpdateRepository
    {
        private readonly MongoDbContext _context;

        public FounderUpdateRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(FounderUpdate update)
        {
            await _context.FounderUpdates.InsertOneAsync(update);
        }

        public async Task<IEnumerable<FounderUpdate>> GetByFounderIdAsync(string founderId, int skip, int take)
        {
            return await _context.FounderUpdates
                .Find(u => u.FounderId == founderId)
                .SortByDescending(u => u.CreatedAt)
                .Skip(skip)
                .Limit(take)
                .ToListAsync();
        }

        public async Task<FounderUpdate?> GetByIdAsync(string id)
        {
            return await _context.FounderUpdates.Find(u => u.Id == id).FirstOrDefaultAsync();
        }
    }
}

