using System;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Interests;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Enums;

namespace FounderHub.Application.Services
{
    public class InterestService : IInterestService
    {
        private readonly IInterestRepository _interestRepository;
        private readonly IIdeaRepository _ideaRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IConnectionRepository _connectionRepository;

        public InterestService(
            IInterestRepository interestRepository, 
            IIdeaRepository ideaRepository,
            INotificationRepository notificationRepository,
            IConnectionRepository connectionRepository)
        {
            _interestRepository = interestRepository;
            _ideaRepository = ideaRepository;
            _notificationRepository = notificationRepository;
            _connectionRepository = connectionRepository;
        }

        public async Task ExpressInterestAsync(string ideaId, string investorId, ExpressInterestRequest request)
        {
            var idea = await _ideaRepository.GetByIdAsync(ideaId);
            if (idea == null) throw new Exception("Idea not found");
            if (idea.FounderId == investorId) throw new Exception("Investor cannot express interest in own idea");

            if (!Enum.TryParse<InterestStatus>(request.Status, true, out var status))
                throw new Exception("Invalid status. Must be 'Interested', 'HighlyInterested', 'Maybe', or 'Pass'.");

            var existingInterest = await _interestRepository.GetInterestAsync(ideaId, investorId);
            if (existingInterest != null)
            {
                existingInterest.Status = status;
                existingInterest.UpdatedAt = DateTime.UtcNow;
                await _interestRepository.UpdateAsync(existingInterest);
            }
            else
            {
                var interest = new Interest
                {
                    IdeaId = ideaId,
                    InvestorId = investorId,
                    Status = status,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _interestRepository.CreateAsync(interest);
            }

            // Trigger Notification to Founder
            await _notificationRepository.CreateAsync(new Notification
            {
                UserId = idea.FounderId,
                Title = "New Interest in your Idea!",
                Body = $"An investor is {status} in '{idea.Title}'.",
                Type = "NewInterest",
                IsRead = false,
                ReferenceId = idea.Id,
                CreatedAt = DateTime.UtcNow
            });

            // If HighlyInterested, auto-initiate connection
            if (status == InterestStatus.HighlyInterested)
            {
                var existingConn = await _connectionRepository.GetConnectionAsync(idea.FounderId, investorId);
                if (existingConn == null)
                {
                    var connectionId = Guid.NewGuid().ToString();
                    await _connectionRepository.CreateAsync(new Connection
                    {
                        Id = connectionId,
                        FounderId = idea.FounderId,
                        InvestorId = investorId,
                        Status = "Pending",
                        InitiatedBy = investorId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });

                    await _notificationRepository.CreateAsync(new Notification
                    {
                        UserId = idea.FounderId,
                        Title = "New Connection Request",
                        Body = $"Interest in '{idea.Title}' triggered a connection request.",
                        Type = "ConnectionRequest",
                        IsRead = false,
                        ReferenceId = connectionId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        public async Task<InterestCountResponse> GetInterestCountAsync(string ideaId, string founderId)
        {
            var idea = await _ideaRepository.GetByIdAsync(ideaId);
            if (idea == null) throw new Exception("Idea not found");
            if (idea.FounderId != founderId) throw new UnauthorizedAccessException("Only the founder can view interest counts");

            var interestedCount = await _interestRepository.GetInterestedCountAsync(ideaId);
            var maybeCount = await _interestRepository.GetMaybeCountAsync(ideaId);

            return new InterestCountResponse
            {
                InterestedCount = interestedCount,
                MaybeCount = maybeCount
            };
        }
    }
}
