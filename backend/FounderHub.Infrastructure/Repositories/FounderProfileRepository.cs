using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class FounderProfileRepository : IFounderProfileRepository
    {
        private readonly MongoDbContext _context;

        public FounderProfileRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<FounderProfile?> GetByUserIdAsync(string userId)
        {
            return await _context.FounderProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(FounderProfile profile)
        {
            await _context.FounderProfiles.InsertOneAsync(profile);
        }

        public async Task UpdateAsync(FounderProfile profile)
        {
            await _context.FounderProfiles.ReplaceOneAsync(p => p.Id == profile.Id, profile);
        }
    }
}
