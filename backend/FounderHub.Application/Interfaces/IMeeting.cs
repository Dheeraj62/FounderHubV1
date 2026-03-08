using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Meetings;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Interfaces
{
    public interface IMeetingRepository
    {
        Task<IEnumerable<Meeting>> GetByInvestorIdAsync(string investorId);
        Task<IEnumerable<Meeting>> GetByFounderIdAsync(string founderId);
        Task<Meeting?> GetByIdAsync(string id);
        Task CreateAsync(Meeting meeting);
        Task UpdateAsync(Meeting meeting);
    }

    public interface IMeetingService
    {
        Task<MeetingDto> RequestMeetingAsync(RequestMeetingDto request, string investorId);
        Task UpdateMeetingStatusAsync(string meetingId, UpdateMeetingStatusDto dto, string userId);
        Task<IEnumerable<MeetingDto>> GetMyMeetingsAsync(string userId, string role);
    }
}
