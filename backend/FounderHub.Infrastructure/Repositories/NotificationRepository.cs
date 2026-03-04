using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly MongoDbContext _context;

        public NotificationRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetByUserIdAsync(string userId)
        {
            return await _context.Notifications.Find(n => n.UserId == userId).ToListAsync();
        }

        public async Task CreateAsync(Notification notification)
        {
            await _context.Notifications.InsertOneAsync(notification);
        }

        public async Task UpdateAsync(Notification notification)
        {
            await _context.Notifications.ReplaceOneAsync(n => n.Id == notification.Id, notification);
        }

        public async Task<Notification?> GetByIdAsync(string id)
        {
            return await _context.Notifications.Find(n => n.Id == id).FirstOrDefaultAsync();
        }
    }
}
