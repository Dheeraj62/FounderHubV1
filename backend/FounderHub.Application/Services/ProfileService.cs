using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly IUserRepository _userRepo;
        private readonly IFollowRepository _followRepo;
        private readonly IIdeaRepository _ideaRepo;
        private readonly IIdeaViewRepository _ideaViewRepo;
        private readonly IInterestRepository _interestRepo;

        public ProfileService(
            IFounderProfileRepository founderRepo,
            IInvestorProfileRepository investorRepo,
            IUserRepository userRepo,
            IFollowRepository followRepo,
            IIdeaRepository ideaRepo,
            IIdeaViewRepository ideaViewRepo,
            IInterestRepository interestRepo)
        {
            _founderRepo = founderRepo;
            _investorRepo = investorRepo;
            _userRepo = userRepo;
            _followRepo = followRepo;
            _ideaRepo = ideaRepo;
            _ideaViewRepo = ideaViewRepo;
            _interestRepo = interestRepo;
        }

        // ─── Existing: Get Founder Profile (by userId, for profile editor) ─

        public async Task<FounderProfileDto?> GetFounderProfileAsync(string userId)
        {
            var profile = await _founderRepo.GetByUserIdAsync(userId);
            if (profile == null) return null;

            return MapFounderDto(profile);
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

        // ─── Existing: Get Investor Profile (by userId, for profile editor) ─

        public async Task<InvestorProfileDto?> GetInvestorProfileAsync(string userId)
        {
            var profile = await _investorRepo.GetByUserIdAsync(userId);
            if (profile == null) return null;

            return MapInvestorDto(profile);
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

        // ─── New: Public Founder Profile ─────────────────────────────────

        public async Task<PublicFounderProfileDto?> GetPublicFounderProfileAsync(string username)
        {
            var user = await _userRepo.GetByUsernameAsync(username);
            if (user == null || user.Role != Domain.Enums.UserRole.Founder) return null;

            var profile = await _founderRepo.GetByUserIdAsync(user.Id);

            var followers = (await _followRepo.GetFollowersAsync(user.Id, "FOUNDER")).Count();
            var following = (await _followRepo.GetFollowingAsync(user.Id)).Count();
            var ideas = (await _ideaRepo.GetByFounderIdAsync(user.Id)).ToList();
            var totalIdeaViews = await _ideaViewRepo.GetFounderTotalViewsAsync(user.Id);

            // Count investor interests across all ideas
            var ideaIds = ideas.Select(i => i.Id).ToList();
            var interestedCounts = await _interestRepo.GetInterestedCountBatchAsync(ideaIds);
            var totalInterests = interestedCounts.Values.Sum();

            var completion = CalculateFounderCompletion(user, profile);

            return new PublicFounderProfileDto
            {
                UserId = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Headline = user.Headline,
                ProfilePictureUrl = user.ProfilePictureUrl,
                CoverImageUrl = user.CoverImageUrl,
                LinkedInVerified = user.LinkedInVerified,
                EmailVerified = user.EmailVerified,
                ReputationScore = user.ReputationScore,
                JoinedAt = user.CreatedAt,

                Bio = profile?.Bio ?? string.Empty,
                Location = profile?.Location ?? string.Empty,
                CurrentStartup = profile?.CurrentStartup ?? string.Empty,
                StartupStage = profile?.StartupStage ?? string.Empty,
                TechnicalFounder = profile?.TechnicalFounder ?? false,
                PreviousStartupCount = profile?.PreviousStartupCount ?? 0,
                DomainExperienceYears = profile?.DomainExperienceYears ?? 0,
                TeamSize = profile?.TeamSize ?? 0,
                Skills = profile?.Skills ?? new(),
                Industries = profile?.Industries ?? new(),
                LookingFor = profile?.LookingFor ?? new(),

                StartupWebsite = profile?.StartupWebsite,
                GitHubUrl = profile?.GitHubUrl,
                TwitterUrl = profile?.TwitterUrl,
                Website = profile?.Website,
                LinkedInProfileUrl = profile?.LinkedInProfileUrl ?? user.LinkedInProfileUrl,

                FollowerCount = followers,
                FollowingCount = following,
                IdeaCount = ideas.Count,
                TotalProfileViews = 0, // TODO: implement profile view tracking
                TotalIdeaViews = totalIdeaViews,
                InvestorInterestCount = totalInterests,
                ProfileCompletionPercent = completion.Percent
            };
        }

        // ─── New: Public Investor Profile ────────────────────────────────

        public async Task<PublicInvestorProfileDto?> GetPublicInvestorProfileAsync(string username)
        {
            var user = await _userRepo.GetByUsernameAsync(username);
            if (user == null || user.Role != Domain.Enums.UserRole.Investor) return null;

            var profile = await _investorRepo.GetByUserIdAsync(user.Id);

            var followers = (await _followRepo.GetFollowersAsync(user.Id, "INVESTOR")).Count();
            var following = (await _followRepo.GetFollowingAsync(user.Id)).Count();

            var completion = CalculateInvestorCompletion(user, profile);

            return new PublicInvestorProfileDto
            {
                UserId = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Headline = user.Headline,
                ProfilePictureUrl = user.ProfilePictureUrl,
                CoverImageUrl = user.CoverImageUrl,
                LinkedInVerified = user.LinkedInVerified,
                EmailVerified = user.EmailVerified,
                ReputationScore = user.ReputationScore,
                JoinedAt = user.CreatedAt,

                Bio = profile?.Bio ?? string.Empty,
                Location = profile?.Location ?? string.Empty,
                InvestmentFirm = profile?.InvestmentFirm,
                Position = profile?.Position,
                InvestmentThesis = profile?.InvestmentThesis,
                AverageTicketSize = profile?.AverageTicketSize,
                TicketSizeRange = profile?.TicketSizeRange ?? string.Empty,
                InvestmentStage = profile?.InvestmentStage ?? string.Empty,
                PreferredIndustries = profile?.PreferredIndustries ?? new(),
                PreferredStages = profile?.PreferredStages ?? new(),
                PortfolioCompanies = profile?.PortfolioCompanies ?? new(),

                AngelListProfile = profile?.AngelListProfile,
                Website = profile?.Website,
                LinkedInProfileUrl = profile?.LinkedInProfileUrl ?? user.LinkedInProfileUrl,

                FollowerCount = followers,
                FollowingCount = following,
                CompaniesInvested = profile?.PortfolioCompanies?.Count ?? 0,
                ProfileCompletionPercent = completion.Percent
            };
        }

        // ─── New: Update User Profile (name, headline) ──────────────────

        public async Task UpdateUserProfileAsync(string userId, UpdateUserProfileRequest request)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return;

            user.FullName = request.FullName;
            user.Headline = request.Headline;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);
        }

        public async Task UpdateProfilePictureAsync(string userId, string url)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return;

            user.ProfilePictureUrl = url;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);
        }

        public async Task UpdateCoverImageAsync(string userId, string url)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return;

            user.CoverImageUrl = url;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);
        }

        // ─── New: Profile Completion ─────────────────────────────────────

        public async Task<ProfileCompletionDto> GetProfileCompletionAsync(string userId, string role)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return new ProfileCompletionDto { Percent = 0, MissingFields = new() { "Account not found" } };

            if (role == "Founder")
            {
                var profile = await _founderRepo.GetByUserIdAsync(userId);
                return CalculateFounderCompletion(user, profile);
            }
            else
            {
                var profile = await _investorRepo.GetByUserIdAsync(userId);
                return CalculateInvestorCompletion(user, profile);
            }
        }

        // ─── Private helpers ─────────────────────────────────────────────

        private static ProfileCompletionDto CalculateFounderCompletion(User user, FounderProfile? profile)
        {
            var missing = new List<string>();
            var total = 12;
            var filled = 0;

            // User-level fields
            if (!string.IsNullOrWhiteSpace(user.FullName)) filled++; else missing.Add("Full Name");
            if (!string.IsNullOrWhiteSpace(user.Headline)) filled++; else missing.Add("Headline");
            if (!string.IsNullOrWhiteSpace(user.ProfilePictureUrl)) filled++; else missing.Add("Profile Picture");
            if (user.LinkedInVerified) filled++; else missing.Add("LinkedIn Verification");

            // Profile-level fields
            if (profile != null)
            {
                if (!string.IsNullOrWhiteSpace(profile.Bio)) filled++; else missing.Add("Bio");
                if (!string.IsNullOrWhiteSpace(profile.Location)) filled++; else missing.Add("Location");
                if (!string.IsNullOrWhiteSpace(profile.CurrentStartup)) filled++; else missing.Add("Current Startup");
                if (profile.Skills.Count > 0) filled++; else missing.Add("Skills");
                if (profile.Industries.Count > 0) filled++; else missing.Add("Industries");
                if (profile.LookingFor.Count > 0) filled++; else missing.Add("Looking For");
                if (profile.DomainExperienceYears > 0) filled++; else missing.Add("Domain Experience");
                if (profile.TeamSize > 0) filled++; else missing.Add("Team Size");
            }
            else
            {
                missing.AddRange(new[] { "Bio", "Location", "Current Startup", "Skills", "Industries", "Looking For", "Domain Experience", "Team Size" });
            }

            return new ProfileCompletionDto
            {
                Percent = (int)Math.Round((double)filled / total * 100),
                MissingFields = missing
            };
        }

        private static ProfileCompletionDto CalculateInvestorCompletion(User user, InvestorProfile? profile)
        {
            var missing = new List<string>();
            var total = 10;
            var filled = 0;

            // User-level fields
            if (!string.IsNullOrWhiteSpace(user.FullName)) filled++; else missing.Add("Full Name");
            if (!string.IsNullOrWhiteSpace(user.Headline)) filled++; else missing.Add("Headline");
            if (!string.IsNullOrWhiteSpace(user.ProfilePictureUrl)) filled++; else missing.Add("Profile Picture");
            if (user.LinkedInVerified) filled++; else missing.Add("LinkedIn Verification");

            // Profile-level fields
            if (profile != null)
            {
                if (!string.IsNullOrWhiteSpace(profile.Bio)) filled++; else missing.Add("Bio");
                if (!string.IsNullOrWhiteSpace(profile.Location)) filled++; else missing.Add("Location");
                if (!string.IsNullOrWhiteSpace(profile.InvestmentFirm)) filled++; else missing.Add("Investment Firm");
                if (!string.IsNullOrWhiteSpace(profile.InvestmentThesis)) filled++; else missing.Add("Investment Thesis");
                if (profile.PreferredIndustries.Count > 0) filled++; else missing.Add("Preferred Industries");
                if (profile.PortfolioCompanies.Count > 0) filled++; else missing.Add("Portfolio Companies");
            }
            else
            {
                missing.AddRange(new[] { "Bio", "Location", "Investment Firm", "Investment Thesis", "Preferred Industries", "Portfolio Companies" });
            }

            return new ProfileCompletionDto
            {
                Percent = (int)Math.Round((double)filled / total * 100),
                MissingFields = missing
            };
        }

        private static FounderProfileDto MapFounderDto(FounderProfile profile)
        {
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
                Location = profile.Location,
                GitHubUrl = profile.GitHubUrl,
                TwitterUrl = profile.TwitterUrl,
                Website = profile.Website,
                CurrentStartup = profile.CurrentStartup,
                StartupStage = profile.StartupStage,
                Skills = profile.Skills,
                Industries = profile.Industries,
                LookingFor = profile.LookingFor
            };
        }

        private static InvestorProfileDto MapInvestorDto(InvestorProfile profile)
        {
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
                Position = profile.Position,
                InvestmentThesis = profile.InvestmentThesis,
                AverageTicketSize = profile.AverageTicketSize,
                PortfolioCompanies = profile.PortfolioCompanies,
                AngelListProfile = profile.AngelListProfile,
                Website = profile.Website,
                LinkedInVerified = profile.LinkedInVerified,
                LinkedInProfileUrl = profile.LinkedInProfileUrl
            };
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
            profile.GitHubUrl = request.GitHubUrl;
            profile.TwitterUrl = request.TwitterUrl;
            profile.Website = request.Website;
            profile.CurrentStartup = request.CurrentStartup;
            profile.StartupStage = request.StartupStage;
            profile.Skills = request.Skills;
            profile.Industries = request.Industries;
            profile.LookingFor = request.LookingFor;
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
            profile.Position = request.Position;
            profile.InvestmentThesis = request.InvestmentThesis;
            profile.AverageTicketSize = request.AverageTicketSize;
            profile.PortfolioCompanies = request.PortfolioCompanies;
            profile.AngelListProfile = request.AngelListProfile;
            profile.Website = request.Website;
            profile.LinkedInVerified = request.LinkedInVerified;
            profile.LinkedInProfileUrl = request.LinkedInProfileUrl;
        }
    }
}
