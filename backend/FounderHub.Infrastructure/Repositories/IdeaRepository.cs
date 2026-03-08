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
            var query = _context.Ideas.AsQueryable();

            if (!string.IsNullOrEmpty(stage))
                query = query.Where(i => i.Stage == stage);

            if (!string.IsNullOrEmpty(industry))
                query = query.Where(i => i.Industry == industry);

            if (previouslyRejected.HasValue)
                query = query.Where(i => i.PreviouslyRejected == previouslyRejected.Value);

            if (!string.IsNullOrEmpty(location))
                query = query.Where(i => i.Location != null && i.Location.ToLower().Contains(location.ToLower()));

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(i =>
                    i.Title.ToLower().Contains(keyword.ToLower()) ||
                    i.Problem.ToLower().Contains(keyword.ToLower()) ||
                    i.Solution.ToLower().Contains(keyword.ToLower()));

            var totalCount = await query.CountAsync();

            var ideas = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (ideas, totalCount);
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
