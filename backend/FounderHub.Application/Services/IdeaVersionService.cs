using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.IdeaVersions;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class IdeaVersionService : IIdeaVersionService
    {
        private readonly IIdeaVersionRepository _versionRepo;
        private readonly IIdeaRepository _ideaRepo;

        public IdeaVersionService(IIdeaVersionRepository versionRepo, IIdeaRepository ideaRepo)
        {
            _versionRepo = versionRepo;
            _ideaRepo = ideaRepo;
        }

        public async Task CreateVersionAsync(string userId, string ideaId, CreateVersionRequest request)
        {
            var idea = await _ideaRepo.GetByIdAsync(ideaId);
            if (idea == null) throw new Exception("Idea not found");
            if (idea.FounderId != userId) throw new UnauthorizedAccessException("Only the founder can create versions");

            var latest = await _versionRepo.GetLatestVersionNumberAsync(ideaId);
            var version = new IdeaVersion
            {
                IdeaId = ideaId,
                VersionNumber = latest + 1,
                Problem = request.Problem,
                Solution = request.Solution,
                WhatChanged = request.WhatChanged,
                CreatedAt = DateTime.UtcNow
            };

            await _versionRepo.CreateAsync(version);

            // Also update the main idea to reflect the latest state
            idea.Problem = request.Problem;
            idea.Solution = request.Solution;
            idea.UpdatedAt = DateTime.UtcNow;
            await _ideaRepo.UpdateAsync(idea);
        }

        public async Task<IEnumerable<IdeaVersionDto>> GetVersionsAsync(string ideaId)
        {
            var versions = await _versionRepo.GetByIdeaIdAsync(ideaId);
            return versions.Select(v => new IdeaVersionDto
            {
                Id = v.Id,
                IdeaId = v.IdeaId,
                VersionNumber = v.VersionNumber,
                Problem = v.Problem,
                Solution = v.Solution,
                WhatChanged = v.WhatChanged,
                CreatedAt = v.CreatedAt
            }).OrderByDescending(v => v.VersionNumber);
        }
    }
}
