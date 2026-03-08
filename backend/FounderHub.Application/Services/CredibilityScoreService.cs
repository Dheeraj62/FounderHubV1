using System;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;

namespace FounderHub.Application.Services
{
    /// <summary>
    /// Calculates a credibility score for a founder based on:
    /// - Profile completeness (bio, LinkedIn, GitHub, etc.)
    /// - Total ideas posted
    /// - Total views across all ideas
    /// - Investor interest (Highly Interested counts the most)
    /// </summary>
    public class CredibilityScoreService : ICredibilityScoreService
    {
        private readonly IIdeaRepository _ideaRepository;
        private readonly IIdeaViewRepository _ideaViewRepository;
        private readonly IInterestRepository _interestRepository;
        private readonly IFounderProfileRepository _founderProfileRepository;

        public CredibilityScoreService(
            IIdeaRepository ideaRepository,
            IIdeaViewRepository ideaViewRepository,
            IInterestRepository interestRepository,
            IFounderProfileRepository founderProfileRepository)
        {
            _ideaRepository = ideaRepository;
            _ideaViewRepository = ideaViewRepository;
            _interestRepository = interestRepository;
            _founderProfileRepository = founderProfileRepository;
        }

        public async Task<CredibilityScoreDto> ComputeAsync(string founderId)
        {
            var profile = await _founderProfileRepository.GetByUserIdAsync(founderId);
            var ideas = System.Linq.Enumerable.ToList(await _ideaRepository.GetByFounderIdAsync(founderId));

            // Profile completeness (up to 30 pts)
            int profileScore = 0;
            if (profile != null)
            {
                if (!string.IsNullOrWhiteSpace(profile.Bio)) profileScore += 10;
                if (!string.IsNullOrWhiteSpace(profile.LinkedInProfileUrl)) profileScore += 5;
                if (!string.IsNullOrWhiteSpace(profile.StartupWebsite)) profileScore += 5;
                if (profile.LinkedInVerified) profileScore += 5;
                if (profile.DomainExperienceYears > 0) profileScore += 5;
            }

            // Ideas score (up to 20 pts)
            int ideaScore = Math.Min(ideas.Count * 5, 20);

            // Engagement score from views and interests (up to 50 pts)
            int totalViews = 0;
            int totalInterested = 0;
            int totalMaybe = 0;

            foreach (var idea in ideas)
            {
                totalViews += await _ideaViewRepository.GetIdeaViewCountAsync(idea.Id);
                totalInterested += await _interestRepository.GetInterestedCountAsync(idea.Id);
                totalMaybe += await _interestRepository.GetMaybeCountAsync(idea.Id);
            }

            int engagementScore = Math.Min(
                (totalViews / 10) + (totalInterested * 5) + (totalMaybe * 2),
                50
            );

            int total = profileScore + ideaScore + engagementScore;

            string badge = total switch
            {
                >= 80 => "Elite Founder",
                >= 60 => "Rising Star",
                >= 40 => "Promising",
                >= 20 => "Getting Started",
                _ => "New Founder"
            };

            return new CredibilityScoreDto
            {
                Score = total,
                MaxScore = 100,
                Badge = badge,
                ProfileScore = profileScore,
                IdeaScore = ideaScore,
                EngagementScore = engagementScore,
                TotalIdeas = ideas.Count,
                TotalViews = totalViews
            };
        }
    }
}
