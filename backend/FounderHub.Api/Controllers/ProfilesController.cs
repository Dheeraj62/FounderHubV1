using Asp.Versioning;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Profiles;
using FounderHub.Application.Interfaces;
using FounderHub.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/profiles")]
    public class ProfilesController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IFileUploadService _fileUpload;

        public ProfilesController(IProfileService profileService, IFileUploadService fileUpload)
        {
            _profileService = profileService;
            _fileUpload = fileUpload;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private string GetRole() => User.FindFirstValue(ClaimTypes.Role) ?? "Founder";

        // ─── Authenticated: Own profile (existing) ──────────────────────

        [HttpGet("founder/{userId}")]
        [Authorize]
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
        [Authorize]
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

        // ─── Public: Profile pages (no auth required) ───────────────────

        [HttpGet("public/founder/{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicFounderProfile(string username)
        {
            var result = await _profileService.GetPublicFounderProfileAsync(username);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("public/investor/{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicInvestorProfile(string username)
        {
            var result = await _profileService.GetPublicInvestorProfileAsync(username);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // ─── Authenticated: User-level profile updates ──────────────────

        [HttpPut("user")]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request)
        {
            await _profileService.UpdateUserProfileAsync(GetUserId(), request);
            return NoContent();
        }

        [HttpPost("avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var url = await _fileUpload.UploadImageAsync(file, "avatars");
            await _profileService.UpdateProfilePictureAsync(GetUserId(), url);
            return Ok(new { url });
        }

        [HttpPost("cover")]
        [Authorize]
        public async Task<IActionResult> UploadCover(IFormFile file)
        {
            var url = await _fileUpload.UploadImageAsync(file, "covers");
            await _profileService.UpdateCoverImageAsync(GetUserId(), url);
            return Ok(new { url });
        }

        // ─── Authenticated: Profile completion ──────────────────────────

        [HttpGet("completion")]
        [Authorize]
        public async Task<IActionResult> GetProfileCompletion()
        {
            var result = await _profileService.GetProfileCompletionAsync(GetUserId(), GetRole());
            return Ok(result);
        }
    }
}
