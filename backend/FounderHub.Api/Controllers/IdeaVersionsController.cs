using Asp.Versioning;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.IdeaVersions;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/ideas/{ideaId}/versions")]
    [Authorize]
    public class IdeaVersionsController : ControllerBase
    {
        private readonly IIdeaVersionService _versionService;

        public IdeaVersionsController(IIdeaVersionService versionService)
        {
            _versionService = versionService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> CreateVersion(string ideaId, [FromBody] CreateVersionRequest request)
        {
            await _versionService.CreateVersionAsync(GetUserId(), ideaId, request);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetVersions(string ideaId)
        {
            var result = await _versionService.GetVersionsAsync(ideaId);
            return Ok(result);
        }
    }
}
