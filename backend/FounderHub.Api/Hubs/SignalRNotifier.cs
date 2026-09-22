using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace FounderHub.Api.Hubs;

public class SignalRNotifier : IRealTimeNotifier
{
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly IHubContext<ChatHub> _chatHub;

    public SignalRNotifier(IHubContext<NotificationHub> notificationHub, IHubContext<ChatHub> chatHub)
    {
        _notificationHub = notificationHub;
        _chatHub = chatHub;
    }

    public async Task SendNotificationAsync(string userId, string type, object payload)
        => await _notificationHub.Clients.Group($"user:{userId}")
            .SendAsync("ReceiveNotification", new { type, data = payload });

    public async Task SendChatMessageAsync(string connectionId, object message)
        => await _chatHub.Clients.Group($"chat:{connectionId}")
            .SendAsync("ReceiveMessage", message);

    public async Task SendMeetingUpdateAsync(string userId, object meetingUpdate)
        => await _notificationHub.Clients.Group($"user:{userId}")
            .SendAsync("MeetingUpdate", meetingUpdate);
}
