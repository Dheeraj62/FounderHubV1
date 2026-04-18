using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Config;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        static MongoDbContext()
        {
            var pack = new ConventionPack { new IgnoreExtraElementsConvention(true) };
            ConventionRegistry.Register("IgnoreExtraElements", pack, t => true);
        }

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
        public IMongoCollection<FeedEvent> FeedEvents => _database.GetCollection<FeedEvent>("FeedEvents");
        public IMongoCollection<FounderUpdate> FounderUpdates => _database.GetCollection<FounderUpdate>("FounderUpdates");
        public IMongoCollection<Follow> Follows => _database.GetCollection<Follow>("Follows");
        public IMongoCollection<IdeaView> IdeaViews => _database.GetCollection<IdeaView>("IdeaViews");
        public IMongoCollection<InvestorDeal> InvestorDeals => _database.GetCollection<InvestorDeal>("InvestorDeals");
        public IMongoCollection<Watchlist> Watchlists => _database.GetCollection<Watchlist>("Watchlists");
        public IMongoCollection<InvestorFeedback> InvestorFeedbacks => _database.GetCollection<InvestorFeedback>("InvestorFeedbacks");
        public IMongoCollection<Meeting> Meetings => _database.GetCollection<Meeting>("Meetings");

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

            // Ideas: Index on Industry, Stage, FundingRange, CreatedAt
            Ideas.Indexes.CreateMany(new[]
            {
                new CreateIndexModel<Idea>(Builders<Idea>.IndexKeys.Ascending(i => i.Industry)),
                new CreateIndexModel<Idea>(Builders<Idea>.IndexKeys.Ascending(i => i.Stage)),
                new CreateIndexModel<Idea>(Builders<Idea>.IndexKeys.Descending(i => i.CreatedAt)),
                new CreateIndexModel<Idea>(Builders<Idea>.IndexKeys.Ascending(i => i.FundingRange))
            });

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

            // FeedEvents: Index on CreatedAt + actor
            FeedEvents.Indexes.CreateOne(new CreateIndexModel<FeedEvent>(
                Builders<FeedEvent>.IndexKeys.Descending(e => e.CreatedAt)));
            FeedEvents.Indexes.CreateOne(new CreateIndexModel<FeedEvent>(
                Builders<FeedEvent>.IndexKeys.Ascending(e => e.UserId).Descending(e => e.CreatedAt)));

            // FounderUpdates: Index on FounderId + CreatedAt
            FounderUpdates.Indexes.CreateOne(new CreateIndexModel<FounderUpdate>(
                Builders<FounderUpdate>.IndexKeys.Ascending(u => u.FounderId).Descending(u => u.CreatedAt)));

            // Follows: Unique compound FollowerId + FollowingId + Type
            Follows.Indexes.CreateOne(new CreateIndexModel<Follow>(
                Builders<Follow>.IndexKeys.Ascending(f => f.FollowerId).Ascending(f => f.FollowingId).Ascending(f => f.Type),
                new CreateIndexOptions { Unique = true }));
            Follows.Indexes.CreateOne(new CreateIndexModel<Follow>(
                Builders<Follow>.IndexKeys.Ascending(f => f.FollowerId).Ascending(f => f.Type)));
            Follows.Indexes.CreateOne(new CreateIndexModel<Follow>(
                Builders<Follow>.IndexKeys.Ascending(f => f.FollowingId).Ascending(f => f.Type)));

            // IdeaViews: Index on IdeaId + ViewedAt (for trending) and IdeaId + UserId (for de-dupe queries)
            IdeaViews.Indexes.CreateOne(new CreateIndexModel<IdeaView>(
                Builders<IdeaView>.IndexKeys.Ascending(v => v.IdeaId).Descending(v => v.ViewedAt)));
            IdeaViews.Indexes.CreateOne(new CreateIndexModel<IdeaView>(
                Builders<IdeaView>.IndexKeys.Ascending(v => v.IdeaId).Ascending(v => v.UserId)));

            // InvestorDeals: Compound InvestorId + IdeaId
            InvestorDeals.Indexes.CreateOne(new CreateIndexModel<InvestorDeal>(
                Builders<InvestorDeal>.IndexKeys.Ascending(d => d.InvestorId).Ascending(d => d.IdeaId),
                new CreateIndexOptions { Unique = true }));

            // Watchlists: Compound InvestorId + IdeaId
            Watchlists.Indexes.CreateOne(new CreateIndexModel<Watchlist>(
                Builders<Watchlist>.IndexKeys.Ascending(w => w.InvestorId).Ascending(w => w.IdeaId),
                new CreateIndexOptions { Unique = true }));

            // Messages: Compound ConnectionId + CreatedAt for paginated thread queries
            Messages.Indexes.CreateOne(new CreateIndexModel<Message>(
                Builders<Message>.IndexKeys.Ascending(m => m.ConnectionId).Ascending(m => m.CreatedAt)));
        }
    }
}
