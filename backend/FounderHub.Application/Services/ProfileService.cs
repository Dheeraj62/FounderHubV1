using System;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Profiles;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IFounderProfileRepository _founderRepo;
        private readonly IInvestorProfileRepository _investorRepo;

        public ProfileService(IFounderProfileRepository founderRepo, IInvestorProfileRepository investorRepo)
        {
            _founderRepo = founderRepo;
            _investorRepo = investorRepo;
        }

        public async Task<FounderProfileDto?> GetFounderProfileAsync(string userId)
        {
            var profile = await _founderRepo.GetByUserIdAsync(userId);
            if (profile == null) return null;

            return new FounderProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                TechnicalFounder = profile.TechnicalFounder,
                PreviousStartupCount = profile.PreviousStartupCount,
                DomainExperienceYears = profile.DomainExperienceYears,
                TeamSize = profile.TeamSize,
                LinkedInVerified = profile.LinkedInVerified,
                LinkedInProfileUrl = profile.LinkedInProfileUrl,
                StartupWebsite = profile.StartupWebsite,
                Bio = profile.Bio,
                Location = profile.Location
            };
        }

        public async Task UpsertFounderProfileAsync(string userId, UpsertFounderProfileRequest request)
        {
            var profile = await _founderRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new FounderProfile
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                UpdateFounderProfile(profile, request);
                await _founderRepo.CreateAsync(profile);
            }
            else
            {
                UpdateFounderProfile(profile, request);
                profile.UpdatedAt = DateTime.UtcNow;
                await _founderRepo.UpdateAsync(profile);
            }
        }

        public async Task<InvestorProfileDto?> GetInvestorProfileAsync(string userId)
        {
            var profile = await _investorRepo.GetByUserIdAsync(userId);
            if (profile == null) return null;

            return new InvestorProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                PreferredIndustries = profile.PreferredIndustries,
                PreferredStages = profile.PreferredStages,
                PreferredFundingRange = profile.PreferredFundingRange,
                PreferredLocation = profile.PreferredLocation,
                PreferredTeamSize = profile.PreferredTeamSize,
                InvestmentStage = profile.InvestmentStage,
                TicketSizeRange = profile.TicketSizeRange,
                Location = profile.Location,
                Bio = profile.Bio,
                InvestmentFirm = profile.InvestmentFirm,
                PortfolioCompanies = profile.PortfolioCompanies,
                AngelListProfile = profile.AngelListProfile,
                LinkedInVerified = profile.LinkedInVerified,
                LinkedInProfileUrl = profile.LinkedInProfileUrl
            };
        }

        public async Task UpsertInvestorProfileAsync(string userId, UpsertInvestorProfileRequest request)
        {
            var profile = await _investorRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new InvestorProfile
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                UpdateInvestorProfile(profile, request);
                await _investorRepo.CreateAsync(profile);
            }
            else
            {
                UpdateInvestorProfile(profile, request);
                profile.UpdatedAt = DateTime.UtcNow;
                await _investorRepo.UpdateAsync(profile);
            }
        }

        private void UpdateFounderProfile(FounderProfile profile, UpsertFounderProfileRequest request)
        {
            profile.TechnicalFounder = request.TechnicalFounder;
            profile.PreviousStartupCount = request.PreviousStartupCount;
            profile.DomainExperienceYears = request.DomainExperienceYears;
            profile.TeamSize = request.TeamSize;
            profile.LinkedInVerified = request.LinkedInVerified;
            profile.LinkedInProfileUrl = request.LinkedInProfileUrl;
            profile.StartupWebsite = request.StartupWebsite;
            profile.Bio = request.Bio;
            profile.Location = request.Location;
        }

        private void UpdateInvestorProfile(InvestorProfile profile, UpsertInvestorProfileRequest request)
        {
            profile.PreferredIndustries = request.PreferredIndustries;
            profile.PreferredStages = request.PreferredStages;
            profile.PreferredFundingRange = request.PreferredFundingRange;
            profile.PreferredLocation = request.PreferredLocation;
            profile.PreferredTeamSize = request.PreferredTeamSize;
            profile.InvestmentStage = request.InvestmentStage;
            profile.TicketSizeRange = request.TicketSizeRange;
            profile.Location = request.Location;
            profile.Bio = request.Bio;
            profile.InvestmentFirm = request.InvestmentFirm;
            profile.PortfolioCompanies = request.PortfolioCompanies;
            profile.AngelListProfile = request.AngelListProfile;
            profile.LinkedInVerified = request.LinkedInVerified;
            profile.LinkedInProfileUrl = request.LinkedInProfileUrl;
        }
    }
}
