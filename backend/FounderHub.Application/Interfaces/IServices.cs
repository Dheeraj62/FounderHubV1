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
