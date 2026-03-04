using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FounderHub.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IIdeaService, IdeaService>();
            services.AddScoped<IInterestService, InterestService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IIdeaVersionService, IdeaVersionService>();
            services.AddScoped<IConnectionService, ConnectionService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<ISavedIdeaService, SavedIdeaService>();
            services.AddScoped<INotificationService, NotificationService>();

            return services;
        }
    }
}
