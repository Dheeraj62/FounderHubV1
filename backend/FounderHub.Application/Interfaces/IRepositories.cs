using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(string id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUsernameAsync(string username);
        Task CreateAsync(User user);
    }

    public interface IIdeaRepository
    {
        Task<Idea?> GetByIdAsync(string id);
        Task<IEnumerable<Idea>> GetByFounderIdAsync(string founderId);
        
        // Paginated & filtered ideas
        Task<(IEnumerable<Idea> Ideas, int TotalCount)> GetIdeasAsync(
            string? stage, 
            string? industry, 
            bool? previouslyRejected,
            string? location,
            string? keyword,
            int page, 
            int pageSize);
            
        Task CreateAsync(Idea idea);
        Task UpdateAsync(Idea idea);
        Task DeleteAsync(string id);
    }

    public interface IInterestRepository
    {
        Task<Interest?> GetInterestAsync(string ideaId, string investorId);
        Task<Interest?> GetByIdAsync(string id);
        Task CreateAsync(Interest interest);
        Task UpdateAsync(Interest interest);
        
        Task<int> GetInterestedCountAsync(string ideaId);
        Task<int> GetMaybeCountAsync(string ideaId);
    }

    public interface IFounderProfileRepository
    {
        Task<FounderProfile?> GetByUserIdAsync(string userId);
        Task CreateAsync(FounderProfile profile);
        Task UpdateAsync(FounderProfile profile);
    }

    public interface IInvestorProfileRepository
    {
        Task<InvestorProfile?> GetByUserIdAsync(string userId);
        Task CreateAsync(InvestorProfile profile);
        Task UpdateAsync(InvestorProfile profile);
        Task<IEnumerable<InvestorProfile>> GetAllAsync();
    }

    public interface IIdeaVersionRepository
    {
        Task<IEnumerable<IdeaVersion>> GetByIdeaIdAsync(string ideaId);
        Task CreateAsync(IdeaVersion version);
        Task<int> GetLatestVersionNumberAsync(string ideaId);
    }

    public interface IConnectionRepository
    {
        Task<Connection?> GetByIdAsync(string id);
        Task<Connection?> GetConnectionAsync(string founderId, string investorId);
        Task<IEnumerable<Connection>> GetByUserIdAsync(string userId);
        Task CreateAsync(Connection connection);
        Task UpdateAsync(Connection connection);
    }

    public interface IMessageRepository
    {
        Task<IEnumerable<Message>> GetByConnectionIdAsync(string connectionId);
        Task CreateAsync(Message message);
    }

    public interface ISavedIdeaRepository
    {
        Task<IEnumerable<SavedIdea>> GetByInvestorIdAsync(string investorId);
        Task<SavedIdea?> GetAsync(string investorId, string ideaId);
        Task CreateAsync(SavedIdea savedIdea);
        Task DeleteAsync(string investorId, string ideaId);
    }

    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetByUserIdAsync(string userId);
        Task CreateAsync(Notification notification);
        Task UpdateAsync(Notification notification);
        Task<Notification?> GetByIdAsync(string id);
    }

    // MVP-3
    public interface IFeedEventRepository
    {
        Task CreateAsync(FeedEvent feedEvent);
        Task<IEnumerable<FeedEvent>> GetLatestAsync(int skip, int take);
    }

    public interface IFounderUpdateRepository
    {
        Task CreateAsync(FounderUpdate update);
        Task<IEnumerable<FounderUpdate>> GetByFounderIdAsync(string founderId, int skip, int take);
        Task<FounderUpdate?> GetByIdAsync(string id);
    }

    public interface IFollowRepository
    {
        Task CreateAsync(Follow follow);
        Task DeleteAsync(string followerId, string followingId, string type);
        Task<Follow?> GetAsync(string followerId, string followingId, string type);
        Task<IEnumerable<Follow>> GetFollowingAsync(string followerId, string? type = null);
        Task<IEnumerable<Follow>> GetFollowersAsync(string followingId, string? type = null);
    }

    public interface IIdeaViewRepository
    {
        Task CreateAsync(IdeaView view);
        Task<int> GetIdeaViewCountAsync(string ideaId);
        Task<int> GetFounderTotalViewsAsync(string founderId);
    }

    public interface IInvestorDealRepository
    {
        Task<IEnumerable<InvestorDeal>> GetByInvestorIdAsync(string investorId);
        Task<InvestorDeal?> GetAsync(string investorId, string ideaId);
        Task<InvestorDeal?> GetByIdAsync(string id);
        Task CreateAsync(InvestorDeal deal);
        Task UpdateAsync(InvestorDeal deal);
        Task<bool> DeleteAsync(string id, string investorId);
    }
    public interface IWatchlistRepository
    {
        Task<IEnumerable<Watchlist>> GetByInvestorIdAsync(string investorId);
        Task<Watchlist?> GetAsync(string investorId, string ideaId);
        Task CreateAsync(Watchlist watchlist);
        Task<bool> DeleteAsync(string investorId, string ideaId);
    }

    public interface IWaitlistRepository
    {
        Task<WaitlistEntry?> GetByEmailAsync(string email);
        Task CreateAsync(WaitlistEntry entry);
    }
}
