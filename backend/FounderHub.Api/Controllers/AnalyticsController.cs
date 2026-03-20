using Asp.Versioning;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize(Roles = "Founder")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        /// <summary>
        /// Returns aggregated analytics for the currently authenticated founder.
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAnalytics()
        {
            try
            {
                var founderId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var summary = await _analyticsService.GetFounderAnalyticsAsync(founderId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
