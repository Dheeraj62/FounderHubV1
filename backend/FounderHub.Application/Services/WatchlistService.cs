using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Watchlists;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using System;

namespace FounderHub.Application.Services
{
    public class WatchlistService : IWatchlistService
    {
        private readonly IWatchlistRepository _watchlistRepository;
        private readonly IIdeaRepository _ideaRepository;
        private readonly IUserRepository _userRepository;

        public WatchlistService(
            IWatchlistRepository watchlistRepository,
            IIdeaRepository ideaRepository,
            IUserRepository userRepository)
        {
            _watchlistRepository = watchlistRepository;
            _ideaRepository = ideaRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<WatchlistDto>> GetMyWatchlistAsync(string userId, string role)
        {
            if (role != "Investor")
                throw new UnauthorizedAccessException("Only investors can view watchlists.");

            var watchlists = await _watchlistRepository.GetByInvestorIdAsync(userId);
            var dtos = new List<WatchlistDto>();

            foreach (var w in watchlists)
            {
                var idea = await _ideaRepository.GetByIdAsync(w.IdeaId);
                if (idea == null) continue;

                var founder = await _userRepository.GetByIdAsync(idea.FounderId);
                
                dtos.Add(new WatchlistDto
                {
                    IdeaId = w.IdeaId,
                    Notes = w.Notes,
                    CreatedAt = w.CreatedAt,
                    IdeaTitle = idea.Title,
                    IdeaIndustry = idea.Industry,
                    IdeaStage = idea.Stage,
                    FounderName = founder?.Username ?? "Unknown Founder"
                });
            }

            return dtos.OrderByDescending(d => d.CreatedAt);
        }

        public async Task AddToWatchlistAsync(AddToWatchlistRequest request, string userId, string role)
        {
            if (role != "Investor")
                throw new UnauthorizedAccessException("Only investors can add to watchlists.");

            var idea = await _ideaRepository.GetByIdAsync(request.IdeaId);
            if (idea == null)
                throw new ArgumentException("Idea not found.");

            var existing = await _watchlistRepository.GetAsync(userId, request.IdeaId);
            if (existing != null)
                throw new InvalidOperationException("Idea is already in the watchlist.");

            var watchlist = new Watchlist
            {
                InvestorId = userId,
                IdeaId = request.IdeaId,
                Notes = request.Notes
            };

            await _watchlistRepository.CreateAsync(watchlist);
        }

        public async Task RemoveFromWatchlistAsync(string ideaId, string userId)
        {
            await _watchlistRepository.DeleteAsync(userId, ideaId);
        }
    }
}
