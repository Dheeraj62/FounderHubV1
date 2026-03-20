using Asp.Versioning;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/saved-ideas")]
    [Authorize(Roles = "Investor")]
    public class SavedIdeasController : ControllerBase
    {
        private readonly ISavedIdeaService _savedIdeaService;

        public SavedIdeasController(ISavedIdeaService savedIdeaService)
        {
            _savedIdeaService = savedIdeaService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("{ideaId}")]
        public async Task<IActionResult> SaveIdea(string ideaId)
        {
            await _savedIdeaService.SaveIdeaAsync(GetUserId(), ideaId);
            return Ok();
        }

        [HttpDelete("{ideaId}")]
        public async Task<IActionResult> UnsaveIdea(string ideaId)
        {
            await _savedIdeaService.UnsaveIdeaAsync(GetUserId(), ideaId);
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetSavedIdeas()
        {
            var result = await _savedIdeaService.GetSavedIdeasAsync(GetUserId());
            return Ok(result);
        }
    }
}
