using Asp.Versioning;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/alerts")]
    [Authorize]
    public class AlertsController : ControllerBase
    {
        private readonly IMongoCollection<Alert> _alerts;

        public AlertsController(IMongoDatabase database)
        {
            _alerts = database.GetCollection<Alert>("Alerts");
        }

        /// <summary>
        /// GET /api/v1/alerts — returns unread alerts for the current investor.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAlerts()
        {
            var userId = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var alerts = await _alerts
                .Find(a => a.UserId == userId)
                .SortByDescending(a => a.CreatedAt)
                .Limit(50)
                .ToListAsync();

            return Ok(alerts);
        }

        /// <summary>
        /// POST /api/v1/alerts/{id}/read — marks a single alert as read.
        /// </summary>
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkRead(string id)
        {
            var userId = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var update = Builders<Alert>.Update.Set(a => a.IsRead, true);
            var result = await _alerts.UpdateOneAsync(
                a => a.Id == id && a.UserId == userId,
                update
            );

            if (result.MatchedCount == 0) return NotFound();
            return Ok();
        }

        /// <summary>
        /// POST /api/v1/alerts/read-all — marks all of the user's alerts as read.
        /// </summary>
        [HttpPost("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            var userId = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var update = Builders<Alert>.Update.Set(a => a.IsRead, true);
            await _alerts.UpdateManyAsync(a => a.UserId == userId && !a.IsRead, update);
            return Ok();
        }
    }
}
