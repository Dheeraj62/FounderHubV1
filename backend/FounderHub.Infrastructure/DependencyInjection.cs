using FounderHub.Application.Interfaces;
using FounderHub.Infrastructure.Auth;
using FounderHub.Infrastructure.Config;
using FounderHub.Infrastructure.Data;
using FounderHub.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FounderHub.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));
            
            services.AddSingleton<MongoDbContext>();
            
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IIdeaRepository, IdeaRepository>();
            services.AddScoped<IInterestRepository, InterestRepository>();
            services.AddScoped<IFounderProfileRepository, FounderProfileRepository>();
            services.AddScoped<IInvestorProfileRepository, InvestorProfileRepository>();
            services.AddScoped<IIdeaVersionRepository, IdeaVersionRepository>();
            services.AddScoped<IConnectionRepository, ConnectionRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<ISavedIdeaRepository, SavedIdeaRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IFeedEventRepository, FeedEventRepository>();
            services.AddScoped<IFounderUpdateRepository, FounderUpdateRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            services.AddScoped<IIdeaViewRepository, IdeaViewRepository>();
            services.AddScoped<IInvestorDealRepository, InvestorDealRepository>();
            services.AddScoped<IWatchlistRepository, WatchlistRepository>();
            services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            services.AddScoped<IMeetingRepository, MeetingRepository>();
            services.AddScoped<IWaitlistRepository, WaitlistRepository>();
            
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IJwtProvider, JwtProvider>();
            
            return services;
        }
    }
}
