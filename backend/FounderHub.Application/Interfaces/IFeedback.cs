using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Feedback;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Interfaces
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<InvestorFeedback>> GetByIdeaIdAsync(string ideaId);
        Task<InvestorFeedback?> GetByInvestorAndIdeaAsync(string investorId, string ideaId);
        Task CreateAsync(InvestorFeedback feedback);
    }

    public interface IFeedbackService
    {
        Task SubmitFeedbackAsync(SubmitFeedbackRequest request, string investorId);
        Task<IEnumerable<FeedbackDto>> GetFeedbackForIdeaAsync(string ideaId);
    }
}
