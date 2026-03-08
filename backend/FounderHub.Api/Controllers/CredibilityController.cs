using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CredibilityController : ControllerBase
    {
        private readonly ICredibilityScoreService _credibilityScoreService;

        public CredibilityController(ICredibilityScoreService credibilityScoreService)
        {
            _credibilityScoreService = credibilityScoreService;
        }

        /// <summary>
        /// Get the credibility score for a specific founder. Publicly accessible.
        /// </summary>
        [HttpGet("{founderId}")]
        public async Task<IActionResult> GetScore(string founderId)
        {
            try
            {
                var score = await _credibilityScoreService.ComputeAsync(founderId);
                return Ok(score);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get the credibility score for the authenticated founder (self).
        /// </summary>
        [HttpGet("my")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> GetMyScore()
        {
            try
            {
                var founderId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var score = await _credibilityScoreService.ComputeAsync(founderId);
                return Ok(score);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
