using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class IdeaVersionRepository : IIdeaVersionRepository
    {
        private readonly MongoDbContext _context;

        public IdeaVersionRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IdeaVersion>> GetByIdeaIdAsync(string ideaId)
        {
            return await _context.IdeaVersions.Find(v => v.IdeaId == ideaId).ToListAsync();
        }

        public async Task CreateAsync(IdeaVersion version)
        {
            await _context.IdeaVersions.InsertOneAsync(version);
        }

        public async Task<int> GetLatestVersionNumberAsync(string ideaId)
        {
            var latest = await _context.IdeaVersions
                .Find(v => v.IdeaId == ideaId)
                .SortByDescending(v => v.VersionNumber)
                .FirstOrDefaultAsync();
            
            return latest?.VersionNumber ?? 0;
        }
    }
}
