using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext _context;

        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Dictionary<string, User>> GetByIdsAsync(IEnumerable<string> ids)
        {
            var idList = ids.Distinct().ToList();
            if (idList.Count == 0) return new Dictionary<string, User>();
            var filter = Builders<User>.Filter.In(u => u.Id, idList);
            var users = await _context.Users.Find(filter).ToListAsync();
            return users.ToDictionary(u => u.Id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        public async Task<long> CountByRoleAsync(FounderHub.Domain.Enums.UserRole role)
        {
            return await _context.Users.CountDocumentsAsync(u => u.Role == role);
        }

        public async Task UpdateAsync(User user)
        {
            await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }
    }
}
