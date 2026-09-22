using AutoMapper;
using FounderHub.Application.DTOs.Meetings;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Mapping;

public class MeetingMappingProfile : Profile
{
    public MeetingMappingProfile()
    {
        CreateMap<Meeting, MeetingDto>()
            .ForMember(d => d.InvestorName, opt => opt.Ignore())
            .ForMember(d => d.FounderName, opt => opt.Ignore())
            .ForMember(d => d.IdeaTitle, opt => opt.Ignore());
    }
}
