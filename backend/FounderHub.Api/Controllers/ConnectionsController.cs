using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Connections;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/connections")]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IConnectionService _connectionService;

        public ConnectionsController(IConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> SendRequest([FromBody] SendConnectionRequest request)
        {
            await _connectionService.SendRequestAsync(GetUserId(), request);
            return Ok();
        }

        [HttpPut("{id}/accept")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> AcceptRequest(string id)
        {
            await _connectionService.AcceptRequestAsync(GetUserId(), id);
            return Ok();
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> RejectRequest(string id)
        {
            await _connectionService.RejectRequestAsync(GetUserId(), id);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetMyConnections()
        {
            var result = await _connectionService.GetMyConnectionsAsync(GetUserId());
            return Ok(result);
        }
    }
}
