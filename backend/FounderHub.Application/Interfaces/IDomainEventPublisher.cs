using System.Threading;
using System.Threading.Tasks;
using FounderHub.Domain.Events;

namespace FounderHub.Application.Interfaces;

public interface IDomainEventPublisher
{
    ValueTask PublishAsync<T>(T domainEvent, CancellationToken ct = default) where T : IDomainEvent;
}
