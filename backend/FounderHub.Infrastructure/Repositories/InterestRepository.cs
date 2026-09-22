using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class InterestRepository : IInterestRepository
    {
        private readonly MongoDbContext _context;

        public InterestRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Interest?> GetInterestAsync(string ideaId, string investorId)
        {
            return await _context.Interests
                .Find(i => i.IdeaId == ideaId && i.InvestorId == investorId)
                .FirstOrDefaultAsync();
        }

        public async Task<Interest?> GetByIdAsync(string id)
        {
            return await _context.Interests.Find(i => i.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Interest interest)
        {
            await _context.Interests.InsertOneAsync(interest);
        }

        public async Task UpdateAsync(Interest interest)
        {
            await _context.Interests.ReplaceOneAsync(i => i.Id == interest.Id, interest);
        }

        public async Task<int> GetInterestedCountAsync(string ideaId)
        {
            return (int)await _context.Interests
                .CountDocumentsAsync(i => i.IdeaId == ideaId && (i.Status == InterestStatus.Interested || i.Status == InterestStatus.HighlyInterested));
        }

        public async Task<int> GetMaybeCountAsync(string ideaId)
        {
            return (int)await _context.Interests
                .CountDocumentsAsync(i => i.IdeaId == ideaId && i.Status == InterestStatus.Maybe);
        }

        public async Task<Dictionary<string, int>> GetInterestedCountBatchAsync(IEnumerable<string> ideaIds)
        {
            var idList = ideaIds.ToList();
            if (idList.Count == 0) return new Dictionary<string, int>();
            
            var filter = Builders<Interest>.Filter.In(i => i.IdeaId, idList)
                       & (Builders<Interest>.Filter.Eq(i => i.Status, InterestStatus.Interested) 
                        | Builders<Interest>.Filter.Eq(i => i.Status, InterestStatus.HighlyInterested));
            
            var results = await _context.Interests.Aggregate()
                .Match(filter)
                .Group(i => i.IdeaId, g => new { IdeaId = g.Key, Count = g.Count() })
                .ToListAsync();
            
            var dict = results.ToDictionary(r => r.IdeaId, r => r.Count);
            foreach (var id in idList) dict.TryAdd(id, 0);
            return dict;
        }

        public async Task<Dictionary<string, int>> GetMaybeCountBatchAsync(IEnumerable<string> ideaIds)
        {
            var idList = ideaIds.ToList();
            if (idList.Count == 0) return new Dictionary<string, int>();
            
            var filter = Builders<Interest>.Filter.In(i => i.IdeaId, idList)
                       & Builders<Interest>.Filter.Eq(i => i.Status, InterestStatus.Maybe);
            
            var results = await _context.Interests.Aggregate()
                .Match(filter)
                .Group(i => i.IdeaId, g => new { IdeaId = g.Key, Count = g.Count() })
                .ToListAsync();
            
            var dict = results.ToDictionary(r => r.IdeaId, r => r.Count);
            foreach (var id in idList) dict.TryAdd(id, 0);
            return dict;
        }

        public async Task<Dictionary<string, Interest?>> GetInterestBatchAsync(IEnumerable<string> ideaIds, string investorId)
        {
            var idList = ideaIds.ToList();
            if (idList.Count == 0) return new Dictionary<string, Interest?>();
            
            var filter = Builders<Interest>.Filter.In(i => i.IdeaId, idList)
                       & Builders<Interest>.Filter.Eq(i => i.InvestorId, investorId);
            
            var results = await _context.Interests.Find(filter).ToListAsync();
            
            var dict = results.ToDictionary(r => r.IdeaId, r => (Interest?)r);
            foreach (var id in idList) dict.TryAdd(id, null);
            return dict;
        }
    }
}
