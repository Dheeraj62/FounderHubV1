using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
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
        private readonly AutoMapper.IMapper _mapper;

        public SmartMatchService(
            IInvestorProfileRepository investorRepo,
            IIdeaRepository ideaRepo,
            IAIMatchService aiMatchService,
            IInterestRepository interestRepo,
            ILogger<SmartMatchService> logger,
            AutoMapper.IMapper mapper)
        {
            _investorRepo = investorRepo;
            _ideaRepo = ideaRepo;
            _aiMatchService = aiMatchService;
            _interestRepo = interestRepo;
            _logger = logger;
            _mapper = mapper;
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
            var (ideaEntities, _) = await _ideaRepo.GetIdeasAsync(null, null, null, null, null, 1, 1000);
            var ideaLookup = ideaEntities.ToDictionary(i => i.Id);

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

            foreach (var idea in ideaEntities)
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

        private async Task<RecommendedIdeaDto> MapToDtoAsync(Idea idea, string userId, int matchScore, List<string> reasons, double aiScore, string aiReason)
        {
            var dto = _mapper.Map<RecommendedIdeaDto>(idea);
            dto.MatchScore = matchScore;
            dto.MatchReasons = reasons;
            dto.AiScore = aiScore;
            dto.AiReason = aiReason;
            
            var interest = await _interestRepo.GetInterestAsync(idea.Id, userId);
            dto.CurrentUserInterest = interest?.Status.ToString();
            return dto;
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
