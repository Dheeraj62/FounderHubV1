using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace FounderHub.Application.Services
{
    public class SmartMatchService : ISmartMatchService
    {
        private readonly IInvestorProfileRepository _investorRepo;
        private readonly IIdeaRepository _ideaRepo;
        private readonly IAIMatchService _aiMatchService;
        private readonly IInterestRepository _interestRepo;
        private readonly ILogger<SmartMatchService> _logger;

        public SmartMatchService(
            IInvestorProfileRepository investorRepo,
            IIdeaRepository ideaRepo,
            IAIMatchService aiMatchService,
            IInterestRepository interestRepo,
            ILogger<SmartMatchService> logger)
        {
            _investorRepo = investorRepo;
            _ideaRepo = ideaRepo;
            _aiMatchService = aiMatchService;
            _interestRepo = interestRepo;
            _logger = logger;
        }

        public async Task<PaginatedResult<RecommendedIdeaDto>> GetSmartMatchesAsync(string userId, int page = 1, int pageSize = 20)
        {
            var profile = await _investorRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                return new PaginatedResult<RecommendedIdeaDto>
                {
                    Items = new List<RecommendedIdeaDto>(),
                    TotalCount = 0,
                    Page = page,
                    PageSize = pageSize
                };
            }

            // Try AI-Powered Matching first
            _logger.LogInformation("Attempting AI matching for {UserId}", userId);
            var aiResults = await _aiMatchService.GetAiMatchesAsync(userId);

            // Fetch all active ideas for enrichment / fallback
            var allIdeas = await _ideaRepo.GetIdeasAsync(null, null, null, null, null, 1, 1000);
            var ideaLookup = allIdeas.Ideas.ToDictionary(i => i.Id);

            if (aiResults != null && aiResults.Count > 0)
            {
                // AI PATH: map AI result ideaIds to full idea DTOs
                _logger.LogInformation("AI matching returned {Count} results.", aiResults.Count);

                var aiScored = new List<RecommendedIdeaDto>();
                foreach (var r in aiResults.OrderByDescending(x => x.MatchScore))
                {
                    if (!ideaLookup.TryGetValue(r.IdeaId, out var idea)) continue;

                    aiScored.Add(await MapToDtoAsync(idea, userId, (int)(r.MatchScore * 100), new List<string> { r.Reason }, r.MatchScore, r.Reason));
                }

                return Paginate(aiScored, page, pageSize);
            }

            // FALLBACK PATH: Rule-based scoring
            _logger.LogWarning("AI service unavailable. Falling back to rule-based matching for {UserId}.", userId);
            var scoredIdeas = new List<RecommendedIdeaDto>();

            foreach (var idea in allIdeas.Ideas)
            {
                int score = 0;
                var reasons = new List<string>();

                if (profile.PreferredIndustries.Any(i => i.Equals(idea.Industry, StringComparison.OrdinalIgnoreCase)))
                { score += 30; reasons.Add("Industry match"); }

                var targetStages = profile.PreferredStages.Any()
                    ? profile.PreferredStages : new List<string> { profile.InvestmentStage };
                if (targetStages.Any(s => s.Equals(idea.Stage, StringComparison.OrdinalIgnoreCase)))
                { score += 25; reasons.Add("Stage match"); }

                var targetFunding = !string.IsNullOrEmpty(profile.PreferredFundingRange) ? profile.PreferredFundingRange : profile.TicketSizeRange;
                if (!string.IsNullOrEmpty(idea.FundingRange) && !string.IsNullOrEmpty(targetFunding))
                { score += 20; reasons.Add("Funding match"); }

                var targetLocation = !string.IsNullOrEmpty(profile.PreferredLocation) ? profile.PreferredLocation : profile.Location;
                if (!string.IsNullOrEmpty(idea.Location) && !string.IsNullOrEmpty(targetLocation) &&
                    idea.Location.Equals(targetLocation, StringComparison.OrdinalIgnoreCase))
                { score += 10; reasons.Add("Location match"); }

                int activity = 0;
                if (!string.IsNullOrEmpty(idea.PitchDeckUrl)) activity += 5;
                if (!string.IsNullOrEmpty(idea.DemoUrl)) activity += 5;
                if (!string.IsNullOrEmpty(idea.TractionMetrics)) activity += 5;
                if (activity > 0) { score += activity; reasons.Add("High profile completeness"); }

                if (score > 20)
                    scoredIdeas.Add(await MapToDtoAsync(idea, userId, score, reasons, 0, string.Empty));
            }

            var sorted = scoredIdeas.OrderByDescending(x => x.MatchScore).ToList();
            return Paginate(sorted, page, pageSize);
        }

        private async Task<RecommendedIdeaDto> MapToDtoAsync(dynamic idea, string userId, int matchScore, List<string> reasons, double aiScore, string aiReason)
        {
            var interest = await _interestRepo.GetInterestAsync(idea.Id, userId);
            
            return new RecommendedIdeaDto
            {
                Id = idea.Id,
                FounderId = idea.FounderId,
                Title = idea.Title,
                Problem = idea.Problem,
                Solution = idea.Solution,
                Stage = idea.Stage,
                Industry = idea.Industry,
                PitchDeckUrl = idea.PitchDeckUrl,
                DemoUrl = idea.DemoUrl,
                StartupWebsite = idea.StartupWebsite,
                ProductImages = idea.ProductImages,
                MarketSize = idea.MarketSize,
                TargetCustomers = idea.TargetCustomers,
                TractionMetrics = idea.TractionMetrics,
                FundingRange = idea.FundingRange,
                Location = idea.Location,
                PreviouslyRejected = idea.PreviouslyRejected,
                RejectedBy = idea.RejectedBy,
                RejectionReasonCategory = idea.RejectionReasonCategory,
                WhatChangedAfterRejection = idea.WhatChangedAfterRejection,
                CreatedAt = idea.CreatedAt,
                UpdatedAt = idea.UpdatedAt,
                MatchScore = matchScore,
                MatchReasons = reasons,
                AiScore = aiScore,
                AiReason = aiReason,
                CurrentUserInterest = interest?.Status.ToString()
            };
        }

        private static PaginatedResult<RecommendedIdeaDto> Paginate(List<RecommendedIdeaDto> items, int page, int pageSize)
        {
            return new PaginatedResult<RecommendedIdeaDto>
            {
                Items = items.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                TotalCount = items.Count,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
