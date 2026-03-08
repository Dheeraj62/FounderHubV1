using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Analytics;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IIdeaRepository _ideaRepository;
        private readonly IIdeaViewRepository _ideaViewRepository;
        private readonly IInterestRepository _interestRepository;

        public AnalyticsService(
            IIdeaRepository ideaRepository,
            IIdeaViewRepository ideaViewRepository,
            IInterestRepository interestRepository)
        {
            _ideaRepository = ideaRepository;
            _ideaViewRepository = ideaViewRepository;
            _interestRepository = interestRepository;
        }

        public async Task<FounderAnalyticsSummaryDto> GetFounderAnalyticsAsync(string founderId)
        {
            var ideas = (await _ideaRepository.GetByFounderIdAsync(founderId)).ToList();

            int totalViews = 0;
            int totalHighly = 0;
            int totalMaybe = 0;
            int totalPass = 0;

            var breakdown = new List<IdeaAnalyticsDto>();

            foreach (var idea in ideas)
            {
                var views = await _ideaViewRepository.GetIdeaViewCountAsync(idea.Id);
                var highly = await _interestRepository.GetInterestedCountAsync(idea.Id);
                var maybe = await _interestRepository.GetMaybeCountAsync(idea.Id);
                // Pass count derived from IdeaId — reuse interest mechanism
                var pass = 0; // Pass is tracked but doesn't have a dedicated count method; default to 0

                totalViews += views;
                totalHighly += highly;
                totalMaybe += maybe;
                totalPass += pass;

                breakdown.Add(new IdeaAnalyticsDto
                {
                    IdeaId = idea.Id,
                    IdeaTitle = idea.Title,
                    Stage = idea.Stage,
                    Industry = idea.Industry,
                    TotalViews = views,
                    HighlyInterestedCount = highly,
                    MaybeCount = maybe,
                    PassCount = pass,
                    CreatedAt = idea.CreatedAt
                });
            }

            return new FounderAnalyticsSummaryDto
            {
                TotalIdeas = ideas.Count,
                TotalViews = totalViews,
                TotalHighlyInterested = totalHighly,
                TotalMaybe = totalMaybe,
                TotalPass = totalPass,
                IdeaBreakdown = breakdown.OrderByDescending(b => b.TotalViews + b.HighlyInterestedCount * 5).ToList()
            };
        }
    }
}
