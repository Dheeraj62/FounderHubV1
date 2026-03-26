using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(MongoDbContext context, IPasswordHasher passwordHasher)
        {
            // Seeding disabled for production
            await Task.CompletedTask;
        }
    }
}
