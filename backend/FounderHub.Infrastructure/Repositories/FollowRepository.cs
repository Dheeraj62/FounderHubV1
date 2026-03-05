using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly MongoDbContext _context;

        public FollowRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Follow follow)
        {
            await _context.Follows.InsertOneAsync(follow);
        }

        public async Task DeleteAsync(string followerId, string followingId, string type)
        {
            await _context.Follows.DeleteOneAsync(f =>
                f.FollowerId == followerId && f.FollowingId == followingId && f.Type == type);
        }

        public async Task<Follow?> GetAsync(string followerId, string followingId, string type)
        {
            return await _context.Follows
                .Find(f => f.FollowerId == followerId && f.FollowingId == followingId && f.Type == type)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Follow>> GetFollowingAsync(string followerId, string? type = null)
        {
            var filter = Builders<Follow>.Filter.Eq(f => f.FollowerId, followerId);
            if (!string.IsNullOrWhiteSpace(type))
                filter &= Builders<Follow>.Filter.Eq(f => f.Type, type);

            return await _context.Follows
                .Find(filter)
                .SortByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Follow>> GetFollowersAsync(string followingId, string? type = null)
        {
            var filter = Builders<Follow>.Filter.Eq(f => f.FollowingId, followingId);
            if (!string.IsNullOrWhiteSpace(type))
                filter &= Builders<Follow>.Filter.Eq(f => f.Type, type);

            return await _context.Follows
                .Find(filter)
                .SortByDescending(f => f.CreatedAt)
                .ToListAsync();
        }
    }
}

