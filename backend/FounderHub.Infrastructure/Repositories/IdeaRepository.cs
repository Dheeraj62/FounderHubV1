using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace FounderHub.Infrastructure.Repositories
{
    public class IdeaRepository : IIdeaRepository
    {
        private readonly MongoDbContext _context;

        public IdeaRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Idea?> GetByIdAsync(string id)
        {
            return await _context.Ideas.Find(i => i.Id == id).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Idea>> GetByIdsAsync(IEnumerable<string> ids)
        {
            var filter = Builders<Idea>.Filter.In(i => i.Id, ids);
            return await _context.Ideas.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<Idea>> GetByFounderIdAsync(string founderId)
        {
            return await _context.Ideas.Find(i => i.FounderId == founderId).ToListAsync();
        }

        // Paginated & filtered ideas
        public async Task<(IEnumerable<Idea> Ideas, int TotalCount)> GetIdeasAsync(
            string? stage,
            string? industry,
            bool? previouslyRejected,
            string? location,
            string? keyword,
            int page,
            int pageSize)
        {
            var filter = Builders<Idea>.Filter.Empty;

            if (!string.IsNullOrEmpty(stage))
                filter &= Builders<Idea>.Filter.Eq(i => i.Stage, stage);

            if (!string.IsNullOrEmpty(industry))
                filter &= Builders<Idea>.Filter.Eq(i => i.Industry, industry);

            if (previouslyRejected.HasValue)
                filter &= Builders<Idea>.Filter.Eq(i => i.PreviouslyRejected, previouslyRejected.Value);

            if (!string.IsNullOrEmpty(location))
                filter &= Builders<Idea>.Filter.Regex(i => i.Location, 
                    new MongoDB.Bson.BsonRegularExpression(location, "i"));

            if (!string.IsNullOrEmpty(keyword))
                filter &= Builders<Idea>.Filter.Text(keyword);

            var totalCount = await _context.Ideas.CountDocumentsAsync(filter);

            var sort = Builders<Idea>.Sort.Descending(i => i.CreatedAt);
            var ideas = await _context.Ideas.Find(filter)
                .Sort(sort)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (ideas, (int)totalCount);
        }

        public async Task CreateAsync(Idea idea)
        {
            await _context.Ideas.InsertOneAsync(idea);
        }

        public async Task UpdateAsync(Idea idea)
        {
            await _context.Ideas.ReplaceOneAsync(i => i.Id == idea.Id, idea);
        }

        public async Task DeleteAsync(string id)
        {
            await _context.Ideas.DeleteOneAsync(i => i.Id == id);
        }
    }
}
