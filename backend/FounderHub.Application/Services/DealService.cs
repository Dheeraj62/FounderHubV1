using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Deals;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class DealService : IDealService
    {
        private readonly IInvestorDealRepository _dealRepository;
        private readonly IIdeaRepository _ideaRepository;
        private readonly IUserRepository _userRepository;

        public DealService(
            IInvestorDealRepository dealRepository,
            IIdeaRepository ideaRepository,
            IUserRepository userRepository)
        {
            _dealRepository = dealRepository;
            _ideaRepository = ideaRepository;
            _userRepository = userRepository;
        }

        public async Task<List<DealDto>> GetInvestorDealsAsync(string investorId)
        {
            var deals = (await _dealRepository.GetByInvestorIdAsync(investorId)).ToList();

            var dealDtos = new List<DealDto>();

            // Hydrate with Idea and Founder info for the KanBan board
            if (deals.Any())
            {
                var ideaIds = deals.Select(d => d.IdeaId).Distinct().ToList();
                var ideas = new List<Idea>();
                foreach (var id in ideaIds)
                {
                    var idea = await _ideaRepository.GetByIdAsync(id);
                    if (idea != null) ideas.Add(idea);
                }
                
                var founderIds = ideas.Select(i => i.FounderId).Distinct().ToList();
                var founders = new List<User>();
                foreach (var id in founderIds)
                {
                    var user = await _userRepository.GetByIdAsync(id);
                    if (user != null) founders.Add(user);
                }

                foreach (var deal in deals)
                {
                    var idea = ideas.FirstOrDefault(i => i.Id == deal.IdeaId);
                    var founder = idea != null ? founders.FirstOrDefault(f => f.Id == idea.FounderId) : null;

                    dealDtos.Add(new DealDto
                    {
                        Id = deal.Id,
                        InvestorId = deal.InvestorId,
                        IdeaId = deal.IdeaId,
                        Stage = deal.Stage,
                        Notes = deal.Notes,
                        CreatedAt = deal.CreatedAt,
                        UpdatedAt = deal.UpdatedAt,
                        IdeaTitle = idea?.Title,
                        FounderName = founder?.Username
                    });
                }
            }

            return dealDtos;
        }

        public async Task<DealDto> CreateDealAsync(string investorId, CreateDealRequest request)
        {
            // Ensure no duplicate deal for this idea
            var existing = await _dealRepository.GetAsync(investorId, request.IdeaId);

            if (existing != null)
                throw new InvalidOperationException("Deal already exists for this idea.");

            var newDeal = new InvestorDeal
            {
                InvestorId = investorId,
                IdeaId = request.IdeaId,
                Stage = request.Stage ?? "Saved",
                Notes = request.Notes
            };

            await _dealRepository.CreateAsync(newDeal);

            return new DealDto
            {
                Id = newDeal.Id,
                InvestorId = newDeal.InvestorId,
                IdeaId = newDeal.IdeaId,
                Stage = newDeal.Stage,
                Notes = newDeal.Notes,
                CreatedAt = newDeal.CreatedAt,
                UpdatedAt = newDeal.UpdatedAt
            };
        }

        public async Task<DealDto> UpdateDealAsync(string investorId, string dealId, UpdateDealRequest request)
        {
            var deal = await _dealRepository.GetByIdAsync(dealId);

            if (deal == null || deal.InvestorId != investorId)
                throw new KeyNotFoundException("Deal not found.");

            deal.Stage = request.Stage;
            if (request.Notes != null) deal.Notes = request.Notes;
            deal.UpdatedAt = DateTime.UtcNow;

            await _dealRepository.UpdateAsync(deal);

            return new DealDto
            {
                Id = deal.Id,
                InvestorId = deal.InvestorId,
                IdeaId = deal.IdeaId,
                Stage = deal.Stage,
                Notes = deal.Notes,
                CreatedAt = deal.CreatedAt,
                UpdatedAt = deal.UpdatedAt
            };
        }

        public async Task DeleteDealAsync(string investorId, string dealId)
        {
            var deleted = await _dealRepository.DeleteAsync(dealId, investorId);
            
            if (!deleted)
                throw new KeyNotFoundException("Deal not found.");
        }
    }
}
