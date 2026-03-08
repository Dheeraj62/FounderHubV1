using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly MongoDbContext _context;

        public FeedbackRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InvestorFeedback>> GetByIdeaIdAsync(string ideaId)
        {
            return await _context.InvestorFeedbacks.Find(f => f.IdeaId == ideaId).ToListAsync();
        }

        public async Task<InvestorFeedback?> GetByInvestorAndIdeaAsync(string investorId, string ideaId)
        {
            return await _context.InvestorFeedbacks
                .Find(f => f.InvestorId == investorId && f.IdeaId == ideaId)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(InvestorFeedback feedback)
        {
            await _context.InvestorFeedbacks.InsertOneAsync(feedback);
        }
    }
}
