using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Updates;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/updates")]
    [Authorize]
    public class UpdatesController : ControllerBase
    {
        private readonly IFounderUpdateService _updates;

        public UpdatesController(IFounderUpdateService updates)
        {
            _updates = updates;
        }

        private string GetUserId() => User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> Create([FromBody] CreateFounderUpdateRequest request)
        {
            var dto = await _updates.CreateAsync(GetUserId(), request);
            return Ok(dto);
        }

        [HttpGet("{founderId}")]
        public async Task<IActionResult> GetByFounder(string founderId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var items = await _updates.GetByFounderIdAsync(founderId, page, pageSize);
            return Ok(items);
        }
    }
}

