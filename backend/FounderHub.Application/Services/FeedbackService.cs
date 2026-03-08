using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Feedback;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IIdeaRepository _ideaRepository;
        private readonly IUserRepository _userRepository;

        public FeedbackService(
            IFeedbackRepository feedbackRepository,
            IIdeaRepository ideaRepository,
            IUserRepository userRepository)
        {
            _feedbackRepository = feedbackRepository;
            _ideaRepository = ideaRepository;
            _userRepository = userRepository;
        }

        public async Task SubmitFeedbackAsync(SubmitFeedbackRequest request, string investorId)
        {
            var idea = await _ideaRepository.GetByIdAsync(request.IdeaId);
            if (idea == null)
                throw new ArgumentException("Idea not found.");

            // Prevent duplicate feedback
            var existing = await _feedbackRepository.GetByInvestorAndIdeaAsync(investorId, request.IdeaId);
            if (existing != null)
                throw new InvalidOperationException("You have already submitted feedback for this idea.");

            var feedback = new InvestorFeedback
            {
                IdeaId = request.IdeaId,
                InvestorId = investorId,
                OverallRating = Math.Clamp(request.OverallRating, 1, 5),
                MarketPotentialScore = Math.Clamp(request.MarketPotentialScore, 1, 5),
                TeamScore = Math.Clamp(request.TeamScore, 1, 5),
                TractionScore = Math.Clamp(request.TractionScore, 1, 5),
                UniqueValueScore = Math.Clamp(request.UniqueValueScore, 1, 5),
                Comments = request.Comments,
                Strengths = request.Strengths,
                Improvements = request.Improvements
            };

            await _feedbackRepository.CreateAsync(feedback);
        }

        public async Task<IEnumerable<FeedbackDto>> GetFeedbackForIdeaAsync(string ideaId)
        {
            var feedbacks = (await _feedbackRepository.GetByIdeaIdAsync(ideaId)).ToList();
            var dtos = new List<FeedbackDto>();

            foreach (var f in feedbacks)
            {
                var investor = await _userRepository.GetByIdAsync(f.InvestorId);
                dtos.Add(new FeedbackDto
                {
                    Id = f.Id,
                    IdeaId = f.IdeaId,
                    InvestorId = f.InvestorId,
                    InvestorName = investor?.Username ?? "Anonymous Investor",
                    OverallRating = f.OverallRating,
                    MarketPotentialScore = f.MarketPotentialScore,
                    TeamScore = f.TeamScore,
                    TractionScore = f.TractionScore,
                    UniqueValueScore = f.UniqueValueScore,
                    Comments = f.Comments,
                    Strengths = f.Strengths,
                    Improvements = f.Improvements,
                    CreatedAt = f.CreatedAt
                });
            }

            return dtos.OrderByDescending(d => d.CreatedAt);
        }
    }
}
