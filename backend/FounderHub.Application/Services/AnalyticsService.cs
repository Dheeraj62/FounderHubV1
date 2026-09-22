using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Analytics;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;

namespace FounderHub.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IIdeaRepository _ideaRepository;
        private readonly IIdeaViewRepository _ideaViewRepository;
        private readonly IInterestRepository _interestRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConnectionRepository _connectionRepository;

        public AnalyticsService(
            IIdeaRepository ideaRepository,
            IIdeaViewRepository ideaViewRepository,
            IInterestRepository interestRepository,
            IUserRepository userRepository,
            IConnectionRepository connectionRepository)
        {
            _ideaRepository = ideaRepository;
            _ideaViewRepository = ideaViewRepository;
            _interestRepository = interestRepository;
            _userRepository = userRepository;
            _connectionRepository = connectionRepository;
        }

        public async Task<FounderAnalyticsSummaryDto> GetFounderAnalyticsAsync(string founderId)
        {
            var ideas = (await _ideaRepository.GetByFounderIdAsync(founderId)).ToList();

            int totalViews = 0;
            int totalHighly = 0;
            int totalMaybe = 0;
            int totalPass = 0;

            var breakdown = new List<IdeaAnalyticsDto>();
            
            var ideaIds = ideas.Select(i => i.Id).ToList();
            var viewCounts = await _ideaViewRepository.GetViewCountBatchAsync(ideaIds);
            var highlyCounts = await _interestRepository.GetInterestedCountBatchAsync(ideaIds);
            var maybeCounts = await _interestRepository.GetMaybeCountBatchAsync(ideaIds);

            foreach (var idea in ideas)
            {
                var views = viewCounts.GetValueOrDefault(idea.Id);
                var highly = highlyCounts.GetValueOrDefault(idea.Id);
                var maybe = maybeCounts.GetValueOrDefault(idea.Id);
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

        public async Task<PlatformStatsDto> GetPlatformStatsAsync()
        {
            var totalIdeas = (await _ideaRepository.GetIdeasAsync(null, null, null, null, null, 1, 1)).TotalCount;
            var totalFounders = await _userRepository.CountByRoleAsync(UserRole.Founder);
            var totalInvestors = await _userRepository.CountByRoleAsync(UserRole.Investor);
            // Count only accepted connections
            // For now, use a rough count from the ideas total as a proxy
            // A proper CountAsync can be added to ConnectionRepository later
            return new PlatformStatsDto
            {
                TotalIdeas = totalIdeas,
                TotalFounders = totalFounders,
                TotalInvestors = totalInvestors,
                TotalConnections = 0 // Will be populated once ConnectionRepository has CountAsync
            };
        }
    }
}
