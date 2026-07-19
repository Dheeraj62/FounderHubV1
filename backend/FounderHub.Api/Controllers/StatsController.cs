using Asp.Versioning;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/stats")]
    public class StatsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public StatsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        /// <summary>
        /// Returns public platform statistics (no authentication required).
        /// Used on the landing page for real-time stats.
        /// </summary>
        [HttpGet("public")]
        public async Task<IActionResult> GetPublicStats()
        {
            var stats = await _analyticsService.GetPlatformStatsAsync();
            return Ok(stats);
        }
    }
}
