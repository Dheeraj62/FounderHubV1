using Asp.Versioning;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Analytics;
using FounderHub.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/behavior")]
    [Authorize]
    public class BehaviorController : ControllerBase
    {
        private readonly IMongoCollection<UserBehaviorLog> _logs;

        public BehaviorController(IMongoDatabase database)
        {
            _logs = database.GetCollection<UserBehaviorLog>("UserBehaviorLogs");
        }

        /// <summary>
        /// Ingest a single user behavior event from the Angular frontend.
        /// Called fire-and-forget; frontend does not require response.
        /// </summary>
        [HttpPost("track")]
        public async Task<IActionResult> Track([FromBody] TrackBehaviorRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var log = new UserBehaviorLog
            {
                UserId = userId,
                IdeaId = request.IdeaId,
                ActionType = request.ActionType,
                DurationSeconds = request.DurationSeconds,
                Timestamp = DateTime.UtcNow
            };

            await _logs.InsertOneAsync(log);
            return Ok();
        }
    }
}
