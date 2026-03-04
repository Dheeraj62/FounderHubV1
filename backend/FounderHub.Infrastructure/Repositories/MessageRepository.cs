using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly MongoDbContext _context;

        public MessageRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetByConnectionIdAsync(string connectionId)
        {
            return await _context.Messages.Find(m => m.ConnectionId == connectionId).ToListAsync();
        }

        public async Task CreateAsync(Message message)
        {
            await _context.Messages.InsertOneAsync(message);
        }
    }
}
