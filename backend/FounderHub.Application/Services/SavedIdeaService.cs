using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class SavedIdeaService : ISavedIdeaService
    {
        private readonly ISavedIdeaRepository _savedIdeaRepo;
        private readonly IIdeaRepository _ideaRepo;

        public SavedIdeaService(ISavedIdeaRepository savedIdeaRepo, IIdeaRepository ideaRepo)
        {
            _savedIdeaRepo = savedIdeaRepo;
            _ideaRepo = ideaRepo;
        }

        public async Task SaveIdeaAsync(string investorId, string ideaId)
        {
            var existing = await _savedIdeaRepo.GetAsync(investorId, ideaId);
            if (existing != null) return;

            var savedIdea = new SavedIdea
            {
                InvestorId = investorId,
                IdeaId = ideaId,
                SavedAt = DateTime.UtcNow
            };

            await _savedIdeaRepo.CreateAsync(savedIdea);
        }

        public async Task UnsaveIdeaAsync(string investorId, string ideaId)
        {
            await _savedIdeaRepo.DeleteAsync(investorId, ideaId);
        }

        public async Task<IEnumerable<IdeaDto>> GetSavedIdeasAsync(string investorId)
        {
            var saved = await _savedIdeaRepo.GetByInvestorIdAsync(investorId);
            var ideas = new List<IdeaDto>();

            foreach (var s in saved)
            {
                var idea = await _ideaRepo.GetByIdAsync(s.IdeaId);
                if (idea != null)
                {
                    ideas.Add(MapToDto(idea));
                }
            }

            return ideas;
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
