using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Profiles;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/profiles")]
    [Authorize]
    public class ProfilesController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfilesController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("founder/{userId}")]
        public async Task<IActionResult> GetFounderProfile(string userId)
        {
            var result = await _profileService.GetFounderProfileAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("founder")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> UpsertFounderProfile([FromBody] UpsertFounderProfileRequest request)
        {
            await _profileService.UpsertFounderProfileAsync(GetUserId(), request);
            return NoContent();
        }

        [HttpGet("investor/{userId}")]
        public async Task<IActionResult> GetInvestorProfile(string userId)
        {
            var result = await _profileService.GetInvestorProfileAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("investor")]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> UpsertInvestorProfile([FromBody] UpsertInvestorProfileRequest request)
        {
            await _profileService.UpsertInvestorProfileAsync(GetUserId(), request);
            return NoContent();
        }
    }
}
