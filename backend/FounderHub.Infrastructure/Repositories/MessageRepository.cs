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

        public async Task AddAsync(Message message)
        {
            await _context.Messages.InsertOneAsync(message);
        }

        public async Task<List<Message>> GetByConnectionIdAsync(string connectionId, int skip, int limit)
        {
            return await _context.Messages
                .Find(m => m.ConnectionId == connectionId)
                .SortBy(m => m.CreatedAt)
                .Skip(skip)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(string connectionId, string receiverId)
        {
            var filter = Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.ConnectionId, connectionId),
                Builders<Message>.Filter.Eq(m => m.ReceiverId, receiverId),
                Builders<Message>.Filter.Eq(m => m.IsRead, false)
            );

            var update = Builders<Message>.Update.Set(m => m.IsRead, true);

            await _context.Messages.UpdateManyAsync(filter, update);
        }
    }
}
