using System;
using System.Threading.Tasks;
using Asp.Versioning;
using FounderHub.Application.DTOs.Waitlist;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FounderHub.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/waitlist")]
    public class WaitlistController : ControllerBase
    {
        private readonly IWaitlistRepository _waitlistRepository;

        public WaitlistController(IWaitlistRepository waitlistRepository)
        {
            _waitlistRepository = waitlistRepository;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var normalized = dto.Email.Trim().ToLowerInvariant();
            var entry = new WaitlistEntry
            {
                Email = normalized,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                await _waitlistRepository.CreateAsync(entry);
            }
            catch (MongoWriteException ex) when (ex.WriteError?.Code == 11000)
            {
                return Conflict(new { message = "This email is already on the list." });
            }

            return StatusCode(StatusCodes.Status201Created, new
            {
                email = entry.Email,
                createdAt = entry.CreatedAt
            });
        }
    }
}
