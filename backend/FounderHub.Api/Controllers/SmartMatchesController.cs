using System;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/smart-matches")]
    [Authorize(Roles = "Investor")]
    public class SmartMatchesController : ControllerBase
    {
        private readonly ISmartMatchService _smartMatchService;

        public SmartMatchesController(ISmartMatchService smartMatchService)
        {
            _smartMatchService = smartMatchService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSmartMatches([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _smartMatchService.GetSmartMatchesAsync(userId, page, pageSize);
            return Ok(result.Items);
        }

        [HttpPost("ai-matching")]
        public IActionResult TriggerAiMatching()
        {
            // Placeholder: This will later connect to a Python service using FastAPI, vector embeddings, semantic similarity.
            return Accepted(new { message = "AI matching job triggered. Matches will be updated shortly." });
        }
    }
}
