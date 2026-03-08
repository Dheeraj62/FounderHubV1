using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Feedback;
using FounderHub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        /// <summary>
        /// Submit structured feedback for a startup idea (Investors only).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Investor")]
        public async Task<IActionResult> SubmitFeedback([FromBody] SubmitFeedbackRequest request)
        {
            try
            {
                var investorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                await _feedbackService.SubmitFeedbackAsync(request, investorId);
                return Ok(new { message = "Feedback submitted successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all feedback for a specific idea (accessible by the founder who owns it or any investor).
        /// </summary>
        [HttpGet("{ideaId}")]
        [Authorize]
        public async Task<IActionResult> GetFeedbackForIdea(string ideaId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbackForIdeaAsync(ideaId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
