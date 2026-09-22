using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Events;

namespace FounderHub.Infrastructure.Events;

public class ChannelDomainEventPublisher : IDomainEventPublisher
{
    private readonly Channel<IDomainEvent> _channel;

    public ChannelDomainEventPublisher(Channel<IDomainEvent> channel)
    {
        _channel = channel;
    }

    public async ValueTask PublishAsync<T>(T domainEvent, CancellationToken ct = default) where T : IDomainEvent
    {
        await _channel.Writer.WriteAsync(domainEvent, ct);
    }
}
