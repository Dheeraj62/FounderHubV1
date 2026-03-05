using System;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class IdeaViewService : IIdeaViewService
    {
        private readonly IIdeaRepository _ideas;
        private readonly IIdeaViewRepository _views;

        public IdeaViewService(IIdeaRepository ideas, IIdeaViewRepository views)
        {
            _ideas = ideas;
            _views = views;
        }

        public async Task TrackViewAsync(string ideaId, string viewerId)
        {
            var idea = await _ideas.GetByIdAsync(ideaId);
            if (idea == null) return;

            // Don't count self-views
            if (idea.FounderId == viewerId) return;

            await _views.CreateAsync(new IdeaView
            {
                IdeaId = ideaId,
                UserId = viewerId,
                ViewedAt = DateTime.UtcNow
            });
        }

        public Task<int> GetIdeaViewsAsync(string ideaId) => _views.GetIdeaViewCountAsync(ideaId);

        public Task<int> GetFounderTotalViewsAsync(string founderId) => _views.GetFounderTotalViewsAsync(founderId);
    }
}

