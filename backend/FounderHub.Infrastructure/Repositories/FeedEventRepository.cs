using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class FeedEventRepository : IFeedEventRepository
    {
        private readonly MongoDbContext _context;

        public FeedEventRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(FeedEvent feedEvent)
        {
            await _context.FeedEvents.InsertOneAsync(feedEvent);
        }

        public async Task<IEnumerable<FeedEvent>> GetLatestAsync(int skip, int take)
        {
            return await _context.FeedEvents
                .Find(_ => true)
                .SortByDescending(e => e.CreatedAt)
                .Skip(skip)
                .Limit(take)
                .ToListAsync();
        }
    }
}

