using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FounderHub.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public async Task JoinConnection(string connectionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"chat:{connectionId}");
    }

    public async Task LeaveConnection(string connectionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"chat:{connectionId}");
    }
}
