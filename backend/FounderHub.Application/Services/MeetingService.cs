using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Meetings;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly IMeetingRepository _meetingRepository;
        private readonly IUserRepository _userRepository;
        private readonly IIdeaRepository _ideaRepository;

        public MeetingService(
            IMeetingRepository meetingRepository,
            IUserRepository userRepository,
            IIdeaRepository ideaRepository)
        {
            _meetingRepository = meetingRepository;
            _userRepository = userRepository;
            _ideaRepository = ideaRepository;
        }

        public async Task<MeetingDto> RequestMeetingAsync(RequestMeetingDto request, string investorId)
        {
            var founder = await _userRepository.GetByIdAsync(request.FounderId);
            if (founder == null)
                throw new ArgumentException("Founder not found.");

            var meeting = new Meeting
            {
                RequestedByInvestorId = investorId,
                FounderId = request.FounderId,
                IdeaId = request.IdeaId,
                ScheduledAt = request.ScheduledAt,
                Platform = request.Platform,
                MeetingLink = request.MeetingLink,
                Notes = request.Notes,
                Status = "Pending"
            };

            await _meetingRepository.CreateAsync(meeting);

            var investor = await _userRepository.GetByIdAsync(investorId);
            string? ideaTitle = null;
            if (request.IdeaId != null)
            {
                var idea = await _ideaRepository.GetByIdAsync(request.IdeaId);
                ideaTitle = idea?.Title;
            }

            return MapToDto(meeting, investor?.Username ?? "Investor", founder.Username, ideaTitle);
        }

        public async Task UpdateMeetingStatusAsync(string meetingId, UpdateMeetingStatusDto dto, string userId)
        {
            var meeting = await _meetingRepository.GetByIdAsync(meetingId);
            if (meeting == null)
                throw new ArgumentException("Meeting not found.");

            if (meeting.FounderId != userId)
                throw new UnauthorizedAccessException("Only the founder of this meeting can update its status.");

            var valid = new[] { "Confirmed", "Declined", "Completed" };
            if (!System.Array.Exists(valid, s => s == dto.Status))
                throw new ArgumentException("Invalid status.");

            meeting.Status = dto.Status;
            await _meetingRepository.UpdateAsync(meeting);
        }

        public async Task<IEnumerable<MeetingDto>> GetMyMeetingsAsync(string userId, string role)
        {
            IEnumerable<Meeting> meetings;
            if (role == "Investor")
                meetings = await _meetingRepository.GetByInvestorIdAsync(userId);
            else
                meetings = await _meetingRepository.GetByFounderIdAsync(userId);

            var dtos = new List<MeetingDto>();
            foreach (var m in meetings)
            {
                var investor = await _userRepository.GetByIdAsync(m.RequestedByInvestorId);
                var founder = await _userRepository.GetByIdAsync(m.FounderId);
                string? ideaTitle = null;
                if (m.IdeaId != null)
                {
                    var idea = await _ideaRepository.GetByIdAsync(m.IdeaId);
                    ideaTitle = idea?.Title;
                }
                dtos.Add(MapToDto(m, investor?.Username ?? "Investor", founder?.Username ?? "Founder", ideaTitle));
            }

            return dtos.OrderBy(d => d.ScheduledAt);
        }

        private static MeetingDto MapToDto(Meeting m, string investorName, string founderName, string? ideaTitle) =>
            new()
            {
                Id = m.Id,
                RequestedByInvestorId = m.RequestedByInvestorId,
                InvestorName = investorName,
                FounderId = m.FounderId,
                FounderName = founderName,
                IdeaId = m.IdeaId,
                IdeaTitle = ideaTitle,
                ScheduledAt = m.ScheduledAt,
                Platform = m.Platform,
                MeetingLink = m.MeetingLink,
                Notes = m.Notes,
                Status = m.Status,
                CreatedAt = m.CreatedAt
            };
    }
}
