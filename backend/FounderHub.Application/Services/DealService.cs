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
        private readonly AutoMapper.IMapper _mapper;

        public DealService(
            IInvestorDealRepository dealRepository,
            IIdeaRepository ideaRepository,
            IUserRepository userRepository,
            AutoMapper.IMapper mapper)
        {
            _dealRepository = dealRepository;
            _ideaRepository = ideaRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<List<DealDto>> GetInvestorDealsAsync(string investorId)
        {
            var deals = (await _dealRepository.GetByInvestorIdAsync(investorId)).ToList();

            var dealDtos = new List<DealDto>();

            // Hydrate with Idea and Founder info for the KanBan board
            if (deals.Any())
            {
                var ideaIds = deals.Select(d => d.IdeaId).Distinct().ToList();
                var ideas = (await _ideaRepository.GetByIdsAsync(ideaIds)).ToDictionary(i => i.Id);
                
                var founderIds = ideas.Values.Select(i => i.FounderId).Distinct().ToList();
                var founders = await _userRepository.GetByIdsAsync(founderIds);

                foreach (var deal in deals)
                {
                    var idea = ideas.GetValueOrDefault(deal.IdeaId);
                    var founder = idea != null ? founders.GetValueOrDefault(idea.FounderId) : null;

                    var dto = _mapper.Map<DealDto>(deal);
                    dto.IdeaTitle = idea?.Title;
                    dto.FounderName = founder?.Username;
                    dealDtos.Add(dto);
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

            return _mapper.Map<DealDto>(newDeal);
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

            return _mapper.Map<DealDto>(deal);
        }

        public async Task DeleteDealAsync(string investorId, string dealId)
        {
            var deleted = await _dealRepository.DeleteAsync(dealId, investorId);
            
            if (!deleted)
                throw new KeyNotFoundException("Deal not found.");
        }
    }
}
