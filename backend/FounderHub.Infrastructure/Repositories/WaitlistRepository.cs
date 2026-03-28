using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class WaitlistRepository : IWaitlistRepository
    {
        private readonly MongoDbContext _context;

        public WaitlistRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<WaitlistEntry?> GetByEmailAsync(string email)
        {
            var normalized = email.Trim().ToLowerInvariant();
            return await _context.WaitlistEntries.Find(e => e.Email == normalized).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(WaitlistEntry entry)
        {
            await _context.WaitlistEntries.InsertOneAsync(entry);
        }
    }
}
