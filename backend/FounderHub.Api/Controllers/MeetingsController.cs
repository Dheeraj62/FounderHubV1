using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Meetings;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MeetingsController : ControllerBase
    {
        private readonly IMeetingService _meetingService;

        public MeetingsController(IMeetingService meetingService)
        {
            _meetingService = meetingService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyMeetings()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var role = User.FindFirstValue(ClaimTypes.Role)!;
                var meetings = await _meetingService.GetMyMeetingsAsync(userId, role);
                return Ok(meetings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> RequestMeeting([FromBody] RequestMeetingDto request)
        {
            try
            {
                var investorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var meeting = await _meetingService.RequestMeetingAsync(request, investorId);
                return Ok(meeting);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Founder")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateMeetingStatusDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                await _meetingService.UpdateMeetingStatusAsync(id, dto, userId);
                return Ok(new { message = "Meeting status updated." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
