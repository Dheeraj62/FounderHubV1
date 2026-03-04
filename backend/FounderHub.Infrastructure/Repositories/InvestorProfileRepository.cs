using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class InvestorProfileRepository : IInvestorProfileRepository
    {
        private readonly MongoDbContext _context;

        public InvestorProfileRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<InvestorProfile?> GetByUserIdAsync(string userId)
        {
            return await _context.InvestorProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(InvestorProfile profile)
        {
            await _context.InvestorProfiles.InsertOneAsync(profile);
        }

        public async Task UpdateAsync(InvestorProfile profile)
        {
            await _context.InvestorProfiles.ReplaceOneAsync(p => p.Id == profile.Id, profile);
        }

        public async Task<IEnumerable<InvestorProfile>> GetAllAsync()
        {
            return await _context.InvestorProfiles.Find(_ => true).ToListAsync();
        }
    }
}
