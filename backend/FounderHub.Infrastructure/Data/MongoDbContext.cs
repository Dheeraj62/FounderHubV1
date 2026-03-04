using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Config;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> options)
        {
            var client = new MongoClient(options.Value.ConnectionString);
            _database = client.GetDatabase(options.Value.DatabaseName);
            
            ConfigureIndexes();
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Idea> Ideas => _database.GetCollection<Idea>("Ideas");
        public IMongoCollection<Interest> Interests => _database.GetCollection<Interest>("Interests");
        public IMongoCollection<FounderProfile> FounderProfiles => _database.GetCollection<FounderProfile>("FounderProfiles");
        public IMongoCollection<InvestorProfile> InvestorProfiles => _database.GetCollection<InvestorProfile>("InvestorProfiles");
        public IMongoCollection<IdeaVersion> IdeaVersions => _database.GetCollection<IdeaVersion>("IdeaVersions");
        public IMongoCollection<Connection> Connections => _database.GetCollection<Connection>("Connections");
        public IMongoCollection<Message> Messages => _database.GetCollection<Message>("Messages");
        public IMongoCollection<SavedIdea> SavedIdeas => _database.GetCollection<SavedIdea>("SavedIdeas");
        public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("Notifications");

        private void ConfigureIndexes()
        {
            // Users: Unique Email, Username
            var userEmailIndexOptions = new CreateIndexOptions { Unique = true };
            var userEmailIndexModel = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Email), userEmailIndexOptions);
                
            var usernameIndexOptions = new CreateIndexOptions { Unique = true };
            var usernameIndexModel = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Username), usernameIndexOptions);
                
            Users.Indexes.CreateMany(new[] { userEmailIndexModel, usernameIndexModel });

            // Interests: Compound IdeasId + InvestorId
            var interestCompoundOptions = new CreateIndexOptions { Unique = true };
            var interestCompoundModel = new CreateIndexModel<Interest>(
                Builders<Interest>.IndexKeys.Ascending(i => i.IdeaId).Ascending(i => i.InvestorId), 
                interestCompoundOptions);
                
            Interests.Indexes.CreateOne(interestCompoundModel);

            // FounderProfiles: Unique UserId
            FounderProfiles.Indexes.CreateOne(new CreateIndexModel<FounderProfile>(
                Builders<FounderProfile>.IndexKeys.Ascending(p => p.UserId), new CreateIndexOptions { Unique = true }));

            // InvestorProfiles: Unique UserId
            InvestorProfiles.Indexes.CreateOne(new CreateIndexModel<InvestorProfile>(
                Builders<InvestorProfile>.IndexKeys.Ascending(p => p.UserId), new CreateIndexOptions { Unique = true }));

            // IdeaVersions: Compound IdeaId + VersionNumber
            IdeaVersions.Indexes.CreateOne(new CreateIndexModel<IdeaVersion>(
                Builders<IdeaVersion>.IndexKeys.Ascending(v => v.IdeaId).Ascending(v => v.VersionNumber), 
                new CreateIndexOptions { Unique = true }));

            // Connections: Compound FounderId + InvestorId
            Connections.Indexes.CreateOne(new CreateIndexModel<Connection>(
                Builders<Connection>.IndexKeys.Ascending(c => c.FounderId).Ascending(c => c.InvestorId), 
                new CreateIndexOptions { Unique = true }));

            // SavedIdeas: Compound InvestorId + IdeaId
            SavedIdeas.Indexes.CreateOne(new CreateIndexModel<SavedIdea>(
                Builders<SavedIdea>.IndexKeys.Ascending(s => s.InvestorId).Ascending(s => s.IdeaId), 
                new CreateIndexOptions { Unique = true }));

            // Notifications: Index on UserId
            Notifications.Indexes.CreateOne(new CreateIndexModel<Notification>(
                Builders<Notification>.IndexKeys.Ascending(n => n.UserId)));
        }
    }
}
