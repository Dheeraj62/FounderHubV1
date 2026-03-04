using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Interests;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/ideas/{ideaId}/interest")]
    [Authorize]
    public class InterestsController : ControllerBase
    {
        private readonly IInterestService _interestService;

        public InterestsController(IInterestService interestService)
        {
            _interestService = interestService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> ExpressInterest(string ideaId, [FromBody] ExpressInterestRequest request)
        {
            await _interestService.ExpressInterestAsync(ideaId, GetUserId(), request);
            return Ok(new { message = "Interest saved" });
        }

        [HttpGet("count")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> GetInterestCount(string ideaId)
        {
            var result = await _interestService.GetInterestCountAsync(ideaId, GetUserId());
            return Ok(result);
        }
    }
}
