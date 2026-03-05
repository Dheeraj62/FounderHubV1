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
    }
}
