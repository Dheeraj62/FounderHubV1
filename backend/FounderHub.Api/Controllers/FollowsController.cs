using Asp.Versioning;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Follows;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}")]
    [Authorize]
    public class FollowsController : ControllerBase
    {
        private readonly IFollowService _follows;

        public FollowsController(IFollowService follows)
        {
            _follows = follows;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("follow")]
        public async Task<IActionResult> Follow([FromBody] FollowRequest request)
        {
            await _follows.FollowAsync(GetUserId(), request);
            return Ok();
        }

        [HttpDelete("follow")]
        public async Task<IActionResult> Unfollow([FromBody] FollowRequest request)
        {
            await _follows.UnfollowAsync(GetUserId(), request);
            return NoContent();
        }

        [HttpGet("following")]
        public async Task<IActionResult> GetFollowing([FromQuery] string? type = null)
        {
            var result = await _follows.GetFollowingAsync(GetUserId(), type);
            return Ok(result);
        }

        [HttpGet("followers")]
        public async Task<IActionResult> GetFollowers([FromQuery] string? type = null)
        {
            var result = await _follows.GetFollowersAsync(GetUserId(), type);
            return Ok(result);
        }
    }
}

