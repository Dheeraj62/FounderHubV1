using System.Threading.Tasks;

namespace FounderHub.Application.Interfaces;

/// <summary>
/// Abstraction over real-time push (SignalR). Application layer depends on
/// this interface; the API layer provides the concrete implementation.
/// This satisfies Dependency Inversion (Clean Architecture boundary).
/// </summary>
public interface IRealTimeNotifier
{
    Task SendNotificationAsync(string userId, string type, object payload);
    Task SendChatMessageAsync(string connectionId, object message);
    Task SendMeetingUpdateAsync(string userId, object meetingUpdate);
}
