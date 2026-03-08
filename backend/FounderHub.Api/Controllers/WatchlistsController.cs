using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Watchlists;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Investor")]
    public class WatchlistsController : ControllerBase
    {
        private readonly IWatchlistService _watchlistService;

        public WatchlistsController(IWatchlistService watchlistService)
        {
            _watchlistService = watchlistService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyWatchlist()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var role = User.FindFirstValue(ClaimTypes.Role)!;
                var watchlist = await _watchlistService.GetMyWatchlistAsync(userId, role);
                return Ok(watchlist);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddToWatchlist([FromBody] AddToWatchlistRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var role = User.FindFirstValue(ClaimTypes.Role)!;
                await _watchlistService.AddToWatchlistAsync(request, userId, role);
                return Ok(new { message = "Added to watchlist successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpDelete("{ideaId}")]
        public async Task<IActionResult> RemoveFromWatchlist(string ideaId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                await _watchlistService.RemoveFromWatchlistAsync(ideaId, userId);
                return Ok(new { message = "Removed from watchlist." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
