using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class ConnectionRepository : IConnectionRepository
    {
        private readonly MongoDbContext _context;

        public ConnectionRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Connection?> GetByIdAsync(string id)
        {
            return await _context.Connections.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Connection?> GetConnectionAsync(string founderId, string investorId)
        {
            return await _context.Connections
                .Find(c => c.FounderId == founderId && c.InvestorId == investorId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Connection>> GetByUserIdAsync(string userId)
        {
            return await _context.Connections
                .Find(c => c.FounderId == userId || c.InvestorId == userId)
                .ToListAsync();
        }

        public async Task CreateAsync(Connection connection)
        {
            await _context.Connections.InsertOneAsync(connection);
        }

        public async Task UpdateAsync(Connection connection)
        {
            await _context.Connections.ReplaceOneAsync(c => c.Id == connection.Id, connection);
        }
    }
}
