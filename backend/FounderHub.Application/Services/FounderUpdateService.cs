using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Updates;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class FounderUpdateService : IFounderUpdateService
    {
        private readonly IFounderUpdateRepository _updates;
        private readonly IFeedEventRepository _feedEvents;
        private readonly IHtmlSanitizerService _sanitizer;

        public FounderUpdateService(IFounderUpdateRepository updates, IFeedEventRepository feedEvents, IHtmlSanitizerService sanitizer)
        {
            _updates = updates;
            _feedEvents = feedEvents;
            _sanitizer = sanitizer;
        }

        public async Task<FounderUpdateDto> CreateAsync(string founderId, CreateFounderUpdateRequest request)
        {
            var update = new FounderUpdate
            {
                FounderId = founderId,
                Content = _sanitizer.Sanitize(request.Content.Trim()),
                CreatedAt = DateTime.UtcNow
            };

            await _updates.CreateAsync(update);

            await _feedEvents.CreateAsync(new FeedEvent
            {
                Type = "FOUNDER_UPDATE",
                UserId = founderId,
                ReferenceId = update.Id,
                CreatedAt = update.CreatedAt
            });

            return new FounderUpdateDto
            {
                Id = update.Id,
                FounderId = update.FounderId,
                Content = update.Content,
                CreatedAt = update.CreatedAt
            };
        }

        public async Task<IEnumerable<FounderUpdateDto>> GetByFounderIdAsync(string founderId, int page = 1, int pageSize = 20)
        {
            var skip = (page - 1) * pageSize;
            var updates = await _updates.GetByFounderIdAsync(founderId, skip, pageSize);
            return updates.Select(u => new FounderUpdateDto
            {
                Id = u.Id,
                FounderId = u.FounderId,
                Content = u.Content,
                CreatedAt = u.CreatedAt
            });
        }
    }
}

