using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly MongoDbContext _context;

    public RefreshTokenRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
    {
        return await _context.RefreshTokens
            .Find(r => r.TokenHash == tokenHash)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<RefreshToken>> GetByUserIdAsync(string userId)
    {
        return await _context.RefreshTokens
            .Find(r => r.UserId == userId)
            .ToListAsync();
    }

    public async Task CreateAsync(RefreshToken token)
    {
        await _context.RefreshTokens.InsertOneAsync(token);
    }

    public async Task UpdateAsync(RefreshToken token)
    {
        await _context.RefreshTokens.ReplaceOneAsync(r => r.Id == token.Id, token);
    }

    public async Task RevokeAllByUserIdAsync(string userId)
    {
        var update = Builders<RefreshToken>.Update.Set(r => r.IsRevoked, true);
        await _context.RefreshTokens.UpdateManyAsync(
            r => r.UserId == userId && !r.IsRevoked, update);
    }
}
