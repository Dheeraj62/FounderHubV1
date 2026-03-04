using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/ideas")]
    [Authorize]
    public class IdeasController : ControllerBase
    {
        private readonly IIdeaService _ideaService;

        public IdeasController(IIdeaService ideaService)
        {
            _ideaService = ideaService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // Founder only
        [HttpPost]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> CreateIdea([FromBody] CreateIdeaRequest request)
        {
            var result = await _ideaService.CreateIdeaAsync(GetUserId(), request);
            return Ok(result);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> GetMyIdeas()
        {
            var result = await _ideaService.GetMyIdeasAsync(GetUserId());
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> UpdateIdea(string id, [FromBody] UpdateIdeaRequest request)
        {
            var result = await _ideaService.UpdateIdeaAsync(GetUserId(), id, request);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> DeleteIdea(string id)
        {
            await _ideaService.DeleteIdeaAsync(GetUserId(), id);
            return NoContent();
        }

        // Both roles
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIdeaById(string id)
        {
            var result = await _ideaService.GetIdeaByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Investor only
        [HttpGet]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> GetIdeas([FromQuery] string? stage, [FromQuery] string? industry, [FromQuery] bool? previouslyRejected, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _ideaService.GetIdeasAsync(stage, industry, previouslyRejected, page, pageSize);
            return Ok(result);
        }

        [HttpGet("recommended")]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> GetRecommended()
        {
            var result = await _ideaService.GetRecommendedAsync(GetUserId());
            return Ok(result);
        }
    }
}
