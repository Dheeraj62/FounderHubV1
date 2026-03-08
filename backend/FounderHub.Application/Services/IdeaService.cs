using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class IdeaService : IIdeaService
    {
        public async Task<IEnumerable<TrendingIdeaDto>> GetTrendingAsync(int limit = 10)
        {
            if (limit < 1) limit = 10;

            var ideas = (await _ideaRepository.GetIdeasAsync(null, null, null, null, null, 1, 200)).Ideas.ToList();
            var scored = new List<TrendingIdeaDto>(ideas.Count);

            foreach (var idea in ideas)
            {
                var views = await _ideaViewRepository.GetIdeaViewCountAsync(idea.Id);
                var interested = await _interestRepository.GetInterestedCountAsync(idea.Id);
                var maybe = await _interestRepository.GetMaybeCountAsync(idea.Id);

                var ageDays = (DateTime.UtcNow - idea.UpdatedAt).TotalDays;
                var recencyBoost = (int)Math.Max(0, 20 - (ageDays * 2)); // simple decay

                var score = (interested * 8) + (maybe * 3) + views + recencyBoost;

                scored.Add(new TrendingIdeaDto
                {
                    TrendingScore = score,
                    ViewsLast7Days = views,
                    InterestsLast7Days = interested + maybe,
                    ConnectionsLast7Days = 0,
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
                    PreviouslyRejected = idea.PreviouslyRejected,
                    RejectedBy = idea.RejectedBy,
                    RejectionReasonCategory = idea.RejectionReasonCategory,
                    WhatChangedAfterRejection = idea.WhatChangedAfterRejection,
                    FundingRange = idea.FundingRange,
                    Location = idea.Location,
                    CreatedAt = idea.CreatedAt,
                    UpdatedAt = idea.UpdatedAt
                });
            }

            return scored
                .OrderByDescending(s => s.TrendingScore)
                .Take(limit);
        }

        public async Task<IEnumerable<RecommendedIdeaDto>> GetRecommendedAsync(string investorId)
        {
            var investorProfile = await _investorRepository.GetByUserIdAsync(investorId);
            if (investorProfile == null) return Enumerable.Empty<RecommendedIdeaDto>();

            var allIdeas = (await _ideaRepository.GetIdeasAsync(null, null, null, null, null, 1, 1000)).Ideas;
            var recommendations = new List<RecommendedIdeaDto>();

            foreach (var idea in allIdeas)
            {
                var score = 0;
                var reasons = new List<string>();

                // 1. Industry Match (40 pts) - Case Insensitive
                if (investorProfile.PreferredIndustries.Any(i => i.Equals(idea.Industry, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 40;
                    reasons.Add($"Matches your preferred industry: {idea.Industry}");
                }

                // 2. Stage Match (30 pts) - Case Insensitive
                if (!string.IsNullOrEmpty(idea.Stage) && idea.Stage.Equals(investorProfile.InvestmentStage, StringComparison.OrdinalIgnoreCase))
                {
                    score += 30;
                    reasons.Add($"Matches your target stage: {idea.Stage}");
                }

                // 3. Ticket Size / Funding Range Overlap (20 pts)
                // Basic logic: if idea funding range contains "K" and investor ticket contains "K", or both "M"
                if (!string.IsNullOrEmpty(investorProfile.TicketSizeRange) && !string.IsNullOrEmpty(idea.FundingRange))
                {
                    bool investorHasM = investorProfile.TicketSizeRange.Contains("M", StringComparison.OrdinalIgnoreCase);
                    bool ideaHasM = idea.FundingRange.Contains("M", StringComparison.OrdinalIgnoreCase);
                    bool investorHasK = investorProfile.TicketSizeRange.Contains("K", StringComparison.OrdinalIgnoreCase);
                    bool ideaHasK = idea.FundingRange.Contains("K", StringComparison.OrdinalIgnoreCase);

                    if ((investorHasM && ideaHasM) || (investorHasK && ideaHasK))
                    {
                        score += 20;
                        reasons.Add("Funding requirements align with your typical ticket size.");
                    }
                }

                // 4. Location Match (10 pts)
                if (!string.IsNullOrEmpty(investorProfile.Location) && !string.IsNullOrEmpty(idea.Location) &&
                    idea.Location.Contains(investorProfile.Location, StringComparison.OrdinalIgnoreCase))
                {
                    score += 10;
                    reasons.Add($"Located in your preferred region: {idea.Location}");
                }

                if (score > 0)
                {
                    var dto = MapToRecommendedDto(idea);
                    dto.MatchScore = score;
                    dto.MatchReasons = reasons;
                    recommendations.Add(dto);
                }
            }

            return recommendations.OrderByDescending(r => r.MatchScore);
        }

        private readonly IIdeaRepository _ideaRepository;
        private readonly IInvestorProfileRepository _investorRepository;
        private readonly IInterestRepository _interestRepository;
        private readonly IIdeaViewRepository _ideaViewRepository;
        private readonly IFeedEventRepository _feedEvents;

        public IdeaService(
            IIdeaRepository ideaRepository,
            IInvestorProfileRepository investorRepository,
            IInterestRepository interestRepository,
            IIdeaViewRepository ideaViewRepository,
            IFeedEventRepository feedEvents)
        {
            _ideaRepository = ideaRepository;
            _investorRepository = investorRepository;
            _interestRepository = interestRepository;
            _ideaViewRepository = ideaViewRepository;
            _feedEvents = feedEvents;
        }

        public async Task<IdeaDto> CreateIdeaAsync(string founderId, CreateIdeaRequest request)
        {
            var idea = new Idea
            {
                FounderId = founderId,
                Title = request.Title,
                Problem = request.Problem,
                Solution = request.Solution,
                Stage = request.Stage,
                Industry = request.Industry,
                PitchDeckUrl = request.PitchDeckUrl,
                DemoUrl = request.DemoUrl,
                StartupWebsite = request.StartupWebsite,
                ProductImages = request.ProductImages ?? new List<string>(),
                MarketSize = request.MarketSize,
                TargetCustomers = request.TargetCustomers,
                TractionMetrics = request.TractionMetrics,
                PreviouslyRejected = request.PreviouslyRejected,
                RejectedBy = request.RejectedBy,
                RejectionReasonCategory = request.RejectionReasonCategory,
                WhatChangedAfterRejection = request.WhatChangedAfterRejection,
                FundingRange = request.FundingRange,
                Location = request.Location,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _ideaRepository.CreateAsync(idea);
            await _feedEvents.CreateAsync(new FeedEvent
            {
                Type = "IDEA_CREATED",
                UserId = founderId,
                ReferenceId = idea.Id,
                CreatedAt = idea.CreatedAt
            });
            return MapToDto(idea);
        }

        public async Task<IdeaDto> UpdateIdeaAsync(string founderId, string ideaId, UpdateIdeaRequest request)
        {
            var idea = await _ideaRepository.GetByIdAsync(ideaId);
            if (idea == null) throw new Exception("Idea not found");
            if (idea.FounderId != founderId) throw new UnauthorizedAccessException("You can only edit your own ideas");

            idea.Title = request.Title;
            idea.Problem = request.Problem;
            idea.Solution = request.Solution;
            idea.Stage = request.Stage;
            idea.Industry = request.Industry;
            idea.PitchDeckUrl = request.PitchDeckUrl;
            idea.DemoUrl = request.DemoUrl;
            idea.StartupWebsite = request.StartupWebsite;
            idea.ProductImages = request.ProductImages ?? new List<string>();
            idea.MarketSize = request.MarketSize;
            idea.TargetCustomers = request.TargetCustomers;
            idea.TractionMetrics = request.TractionMetrics;
            idea.PreviouslyRejected = request.PreviouslyRejected;
            idea.RejectedBy = request.RejectedBy;
            idea.RejectionReasonCategory = request.RejectionReasonCategory;
            idea.WhatChangedAfterRejection = request.WhatChangedAfterRejection;
            idea.FundingRange = request.FundingRange;
            idea.Location = request.Location;
            idea.UpdatedAt = DateTime.UtcNow;

            await _ideaRepository.UpdateAsync(idea);
            await _feedEvents.CreateAsync(new FeedEvent
            {
                Type = "IDEA_UPDATED",
                UserId = founderId,
                ReferenceId = idea.Id,
                CreatedAt = idea.UpdatedAt
            });
            return MapToDto(idea);
        }

        public async Task DeleteIdeaAsync(string founderId, string ideaId)
        {
            var idea = await _ideaRepository.GetByIdAsync(ideaId);
            if (idea == null) throw new Exception("Idea not found");
            if (idea.FounderId != founderId) throw new UnauthorizedAccessException("You can only delete your own ideas");

            await _ideaRepository.DeleteAsync(ideaId);
        }

        public async Task<IdeaDto?> GetIdeaByIdAsync(string ideaId)
        {
            var idea = await _ideaRepository.GetByIdAsync(ideaId);
            return idea != null ? MapToDto(idea) : null;
        }

        public async Task<IEnumerable<IdeaDto>> GetMyIdeasAsync(string founderId)
        {
            var ideas = await _ideaRepository.GetByFounderIdAsync(founderId);
            return ideas.Select(MapToDto);
        }

        public async Task<PaginatedResult<IdeaDto>> GetIdeasAsync(string? stage, string? industry, bool? previouslyRejected, string? location, string? keyword, int page, int pageSize)
        {
            var result = await _ideaRepository.GetIdeasAsync(stage, industry, previouslyRejected, location, keyword, page, pageSize);
            return new PaginatedResult<IdeaDto>
            {
                Items = result.Ideas.Select(MapToDto),
                TotalCount = result.TotalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        private static IdeaDto MapToDto(Idea idea)
        {
            return new IdeaDto
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
                PreviouslyRejected = idea.PreviouslyRejected,
                RejectedBy = idea.RejectedBy,
                RejectionReasonCategory = idea.RejectionReasonCategory,
                WhatChangedAfterRejection = idea.WhatChangedAfterRejection,
                FundingRange = idea.FundingRange,
                Location = idea.Location,
                CreatedAt = idea.CreatedAt,
                UpdatedAt = idea.UpdatedAt
            };
        }

        private static RecommendedIdeaDto MapToRecommendedDto(Idea idea)
        {
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
                PreviouslyRejected = idea.PreviouslyRejected,
                RejectedBy = idea.RejectedBy,
                RejectionReasonCategory = idea.RejectionReasonCategory,
                WhatChangedAfterRejection = idea.WhatChangedAfterRejection,
                FundingRange = idea.FundingRange,
                Location = idea.Location,
                CreatedAt = idea.CreatedAt,
                UpdatedAt = idea.UpdatedAt
            };
        }
    }
}
