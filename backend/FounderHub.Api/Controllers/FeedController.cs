using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/feed")]
    [Authorize]
    public class FeedController : ControllerBase
    {
        private readonly IFeedService _feed;

        public FeedController(IFeedService feed)
        {
            _feed = feed;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetGlobal([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var items = await _feed.GetGlobalFeedAsync(GetUserId(), page, pageSize);
            return Ok(items);
        }

        [HttpGet("following")]
        public async Task<IActionResult> GetFollowing([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var items = await _feed.GetFollowingFeedAsync(GetUserId(), page, pageSize);
            return Ok(items);
        }

        [HttpGet("trending")]
        public async Task<IActionResult> GetTrending([FromQuery] int limit = 10)
        {
            var items = await _feed.GetTrendingFeedAsync(GetUserId(), limit);
            return Ok(items);
        }
    }
}

