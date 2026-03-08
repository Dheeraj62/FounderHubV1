using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class InvestorDealRepository : IInvestorDealRepository
    {
        private readonly IMongoCollection<InvestorDeal> _deals;

        public InvestorDealRepository(MongoDbContext context)
        {
            _deals = context.InvestorDeals;
        }

        public async Task<IEnumerable<InvestorDeal>> GetByInvestorIdAsync(string investorId)
        {
            return await _deals
                .Find(d => d.InvestorId == investorId)
                .SortByDescending(d => d.UpdatedAt)
                .ToListAsync();
        }

        public async Task<InvestorDeal?> GetAsync(string investorId, string ideaId)
        {
            return await _deals
                .Find(d => d.InvestorId == investorId && d.IdeaId == ideaId)
                .FirstOrDefaultAsync();
        }

        public async Task<InvestorDeal?> GetByIdAsync(string id)
        {
            return await _deals
                .Find(d => d.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(InvestorDeal deal)
        {
            await _deals.InsertOneAsync(deal);
        }

        public async Task UpdateAsync(InvestorDeal deal)
        {
            await _deals.ReplaceOneAsync(d => d.Id == deal.Id, deal);
        }

        public async Task<bool> DeleteAsync(string id, string investorId)
        {
            var filter = Builders<InvestorDeal>.Filter.Eq(d => d.Id, id) &
                         Builders<InvestorDeal>.Filter.Eq(d => d.InvestorId, investorId);
            
            var result = await _deals.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }
    }
}
