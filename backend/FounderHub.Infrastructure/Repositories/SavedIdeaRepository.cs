using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class SavedIdeaRepository : ISavedIdeaRepository
    {
        private readonly MongoDbContext _context;

        public SavedIdeaRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SavedIdea>> GetByInvestorIdAsync(string investorId)
        {
            return await _context.SavedIdeas.Find(s => s.InvestorId == investorId).ToListAsync();
        }

        public async Task<SavedIdea?> GetAsync(string investorId, string ideaId)
        {
            return await _context.SavedIdeas.Find(s => s.InvestorId == investorId && s.IdeaId == ideaId).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(SavedIdea savedIdea)
        {
            await _context.SavedIdeas.InsertOneAsync(savedIdea);
        }

        public async Task DeleteAsync(string investorId, string ideaId)
        {
            await _context.SavedIdeas.DeleteOneAsync(s => s.InvestorId == investorId && s.IdeaId == ideaId);
        }
    }
}
