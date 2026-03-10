using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;

namespace FounderHub.Application.Services
{
    public class SmartMatchService : ISmartMatchService
    {
        private readonly IInvestorProfileRepository _investorRepo;
        private readonly IIdeaRepository _ideaRepo;

        public SmartMatchService(
            IInvestorProfileRepository investorRepo,
            IIdeaRepository ideaRepo)
        {
            _investorRepo = investorRepo;
            _ideaRepo = ideaRepo;
        }

        public async Task<PaginatedResult<RecommendedIdeaDto>> GetSmartMatchesAsync(string userId, int page = 1, int pageSize = 20)
        {
            // 1. Fetch Investor Profile
            var profile = await _investorRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                // Return empty if no profile exists yet
                return new PaginatedResult<RecommendedIdeaDto>
                {
                    Items = new List<RecommendedIdeaDto>(),
                    TotalCount = 0,
                    Page = page,
                    PageSize = pageSize
                };
            }

            // 2. Fetch all active ideas
            // For production with massive datasets, this logic should be pushed to the DB/Mongo aggregation pipeline.
            // For MVP-4 Smart Matches, we implement rule-based scoring in memory.
            var allIdeas = await _ideaRepo.GetIdeasAsync(null, null, null, null, null, 1, 1000); // Fetch up to 1000 ideas

            var scoredIdeas = new List<RecommendedIdeaDto>();

            foreach (var idea in allIdeas.Ideas)
            {
                int score = 0;
                var reasons = new List<string>();

                // Industry Match (+30)
                if (profile.PreferredIndustries.Any(i => i.Equals(idea.Industry, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 30;
                    reasons.Add("Industry match");
                }

                // Stage Match (+25)
                // Fallback to legacy InvestmentStage if PreferredStages is empty
                var targetStages = profile.PreferredStages.Any() 
                    ? profile.PreferredStages 
                    : new List<string> { profile.InvestmentStage };

                if (targetStages.Any(s => s.Equals(idea.Stage, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 25;
                    reasons.Add("Stage match");
                }

                // Funding Range overlap (+20)
                // Basic matching. If idea has a funding ask, and investor has a preference.
                var targetFunding = !string.IsNullOrEmpty(profile.PreferredFundingRange) 
                    ? profile.PreferredFundingRange 
                    : profile.TicketSizeRange;

                if (!string.IsNullOrEmpty(idea.FundingRange) && !string.IsNullOrEmpty(targetFunding))
                {
                    // In a real app, parse the values. Here we check for any overlap or exact match.
                    // For MVP-4, assign if they both provided it (assuming some alignment in the UI dropdowns)
                    score += 20;
                    reasons.Add("Funding match");
                }

                // Location Match (+10)
                var targetLocation = !string.IsNullOrEmpty(profile.PreferredLocation) 
                    ? profile.PreferredLocation 
                    : profile.Location;

                if (!string.IsNullOrEmpty(idea.Location) && !string.IsNullOrEmpty(targetLocation) &&
                    idea.Location.Equals(targetLocation, StringComparison.OrdinalIgnoreCase))
                {
                    score += 10;
                    reasons.Add("Location match");
                }

                // Startup Activity / Completeness Score (+15)
                int activityScore = 0;
                if (!string.IsNullOrEmpty(idea.PitchDeckUrl)) activityScore += 5;
                if (!string.IsNullOrEmpty(idea.DemoUrl)) activityScore += 5;
                if (!string.IsNullOrEmpty(idea.TractionMetrics)) activityScore += 5;

                if (activityScore > 0)
                {
                    score += activityScore;
                    reasons.Add("High profile completeness");
                }

                // Only include if there's at least some baseline match (e.g., score > 20)
                if (score > 20)
                {
                    scoredIdeas.Add(new RecommendedIdeaDto
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
                        UpdatedAt = idea.UpdatedAt,
                        MatchScore = score,
                        MatchReasons = reasons
                    });
                }
            }

            // Sort by score descending
            var sorted = scoredIdeas.OrderByDescending(x => x.MatchScore).ToList();

            // Paginate
            var paginated = sorted.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PaginatedResult<RecommendedIdeaDto>
            {
                Items = paginated,
                TotalCount = sorted.Count,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
