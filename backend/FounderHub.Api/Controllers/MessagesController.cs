using Asp.Versioning;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Messages;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/messages")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        /// <summary>
        /// Send a message to a connection partner. ReceiverId is auto-resolved server-side.
        /// </summary>
        [HttpPost]
        [EnableRateLimiting("MessageLimiter")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _messageService.SendMessageAsync(GetUserId(), request);
            return Ok(new { message = "Message sent." });
        }

        /// <summary>
        /// Get paginated messages for a connection thread.
        /// </summary>
        [HttpGet("{connectionId}")]
        public async Task<IActionResult> GetMessages(string connectionId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _messageService.GetMessagesAsync(GetUserId(), connectionId, page, pageSize);
            return Ok(result);
        }

        /// <summary>
        /// Mark all unread messages in a connection as read for the current user.
        /// </summary>
        [HttpPut("{connectionId}/read")]
        public async Task<IActionResult> MarkAsRead(string connectionId)
        {
            await _messageService.MarkAsReadAsync(GetUserId(), connectionId);
            return Ok(new { message = "Messages marked as read." });
        }
    }
}
