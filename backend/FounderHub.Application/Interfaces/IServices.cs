using System.Threading.Tasks;
using FounderHub.Application.DTOs.Auth;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.DTOs.Interests;
using FounderHub.Application.DTOs.Profiles;
using FounderHub.Application.DTOs.IdeaVersions;
using FounderHub.Application.DTOs.Connections;
using FounderHub.Application.DTOs.Messages;
using FounderHub.Application.DTOs.Notifications;
using FounderHub.Application.DTOs.SavedIdeas;
using System.Collections.Generic;
using FounderHub.Application.DTOs.Feed;
using FounderHub.Application.DTOs.Updates;
using FounderHub.Application.DTOs.Follows;

namespace FounderHub.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }

    public interface IIdeaService
    {
        Task<IdeaDto> CreateIdeaAsync(string founderId, CreateIdeaRequest request);
        Task<IdeaDto> UpdateIdeaAsync(string founderId, string ideaId, UpdateIdeaRequest request);
        Task DeleteIdeaAsync(string founderId, string ideaId);
        Task<IdeaDto?> GetIdeaByIdAsync(string ideaId);
        Task<IEnumerable<IdeaDto>> GetMyIdeasAsync(string founderId);
        Task<PaginatedResult<IdeaDto>> GetIdeasAsync(string? stage, string? industry, bool? previouslyRejected, int page, int pageSize);
        Task<IEnumerable<RecommendedIdeaDto>> GetRecommendedAsync(string investorId);
        Task<IEnumerable<TrendingIdeaDto>> GetTrendingAsync(int limit = 10);
    }

    public interface IInterestService
    {
        Task ExpressInterestAsync(string ideaId, string investorId, ExpressInterestRequest request);
        Task<InterestCountResponse> GetInterestCountAsync(string ideaId, string founderId);
    }

    public interface IProfileService
    {
        Task<FounderProfileDto?> GetFounderProfileAsync(string userId);
        Task UpsertFounderProfileAsync(string userId, UpsertFounderProfileRequest request);
        Task<InvestorProfileDto?> GetInvestorProfileAsync(string userId);
        Task UpsertInvestorProfileAsync(string userId, UpsertInvestorProfileRequest request);
    }

    public interface IIdeaVersionService
    {
        Task CreateVersionAsync(string userId, string ideaId, CreateVersionRequest request);
        Task<IEnumerable<IdeaVersionDto>> GetVersionsAsync(string ideaId);
    }

    public interface IConnectionService
    {
        Task SendRequestAsync(string investorId, SendConnectionRequest request);
        Task AcceptRequestAsync(string userId, string connectionId);
        Task RejectRequestAsync(string userId, string connectionId);
        Task<IEnumerable<ConnectionDto>> GetMyConnectionsAsync(string userId);
    }

    public interface IMessageService
    {
        Task SendMessageAsync(string senderId, SendMessageRequest request);
        Task<IEnumerable<MessageDto>> GetThreadAsync(string userId, string connectionId);
    }

    public interface ISavedIdeaService
    {
        Task SaveIdeaAsync(string investorId, string ideaId);
        Task UnsaveIdeaAsync(string investorId, string ideaId);
        Task<IEnumerable<IdeaDto>> GetSavedIdeasAsync(string investorId);
    }

    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetMyNotificationsAsync(string userId);
        Task MarkAsReadAsync(string userId, string notificationId);
        Task MarkAllAsReadAsync(string userId);
    }

    // MVP-3
    public interface IFeedService
    {
        Task<IEnumerable<FeedItemDto>> GetGlobalFeedAsync(string userId, int page = 1, int pageSize = 20);
        Task<IEnumerable<FeedItemDto>> GetFollowingFeedAsync(string userId, int page = 1, int pageSize = 20);
        Task<IEnumerable<FeedItemDto>> GetTrendingFeedAsync(string userId, int limit = 10);
    }

    public interface IFounderUpdateService
    {
        Task<FounderUpdateDto> CreateAsync(string founderId, CreateFounderUpdateRequest request);
        Task<IEnumerable<FounderUpdateDto>> GetByFounderIdAsync(string founderId, int page = 1, int pageSize = 20);
    }

    public interface IFollowService
    {
        Task FollowAsync(string followerId, FollowRequest request);
        Task UnfollowAsync(string followerId, FollowRequest request);
        Task<IEnumerable<FollowDto>> GetFollowingAsync(string followerId, string? type = null);
        Task<IEnumerable<FollowDto>> GetFollowersAsync(string followingId, string? type = null);
    }

    public interface IIdeaViewService
    {
        Task TrackViewAsync(string ideaId, string viewerId);
        Task<int> GetIdeaViewsAsync(string ideaId);
        Task<int> GetFounderTotalViewsAsync(string founderId);
    }
    
    public interface IJwtProvider
    {
        string GenerateToken(Domain.Entities.User user);
    }
    
    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verify(string password, string hash);
    }
}
