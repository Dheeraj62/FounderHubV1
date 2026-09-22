using System;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Events;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FounderHub.Infrastructure.Events;

public class DomainEventProcessorService : BackgroundService
{
    private readonly Channel<IDomainEvent> _channel;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DomainEventProcessorService> _logger;

    public DomainEventProcessorService(
        Channel<IDomainEvent> channel,
        IServiceScopeFactory scopeFactory,
        ILogger<DomainEventProcessorService> logger)
    {
        _channel = channel;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Domain Event Processor started.");
        
        await foreach (var evt in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                await HandleEventAsync(scope.ServiceProvider, evt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process domain event {EventType}", evt.GetType().Name);
            }
        }
    }

    private async Task HandleEventAsync(IServiceProvider sp, IDomainEvent evt)
    {
        var feedRepo = sp.GetRequiredService<IFeedEventRepository>();
        var notifRepo = sp.GetRequiredService<INotificationRepository>();
        var realTime = sp.GetRequiredService<IRealTimeNotifier>();

        switch (evt)
        {
            case IdeaCreatedEvent e:
                await feedRepo.CreateAsync(new FeedEvent
                {
                    Type = "IDEA_CREATED",
                    UserId = e.FounderId,
                    ReferenceId = e.IdeaId,
                    CreatedAt = e.OccurredAt
                });
                _logger.LogInformation("Feed event created for idea {IdeaId}", e.IdeaId);
                break;

            case IdeaUpdatedEvent e:
                await feedRepo.CreateAsync(new FeedEvent
                {
                    Type = "IDEA_UPDATED",
                    UserId = e.FounderId,
                    ReferenceId = e.IdeaId,
                    CreatedAt = e.OccurredAt
                });
                break;

            case InterestExpressedEvent e:
                await feedRepo.CreateAsync(new FeedEvent
                {
                    Type = "INTEREST_EVENT",
                    UserId = e.InvestorId,
                    ReferenceId = e.InterestId,
                    CreatedAt = e.OccurredAt
                });
                var notification = new Notification
                {
                    UserId = e.FounderId,
                    Title = "New Interest in your Idea!",
                    Body = $"An investor is {e.Status} in '{e.IdeaTitle}'.",
                    Type = "NewInterest",
                    IsRead = false,
                    ReferenceId = e.IdeaId,
                    CreatedAt = e.OccurredAt
                };
                await notifRepo.CreateAsync(notification);
                await realTime.SendNotificationAsync(e.FounderId, "NewInterest", notification);
                break;

            case FounderRegisteredEvent e:
                await feedRepo.CreateAsync(new FeedEvent
                {
                    Type = "NEW_FOUNDER",
                    UserId = e.UserId,
                    ReferenceId = null,
                    CreatedAt = e.OccurredAt
                });
                break;

            case MessageSentEvent e:
                await realTime.SendNotificationAsync(e.ReceiverId, "NewMessage", 
                    new { connectionId = e.ConnectionId });
                break;
        }
    }
}
