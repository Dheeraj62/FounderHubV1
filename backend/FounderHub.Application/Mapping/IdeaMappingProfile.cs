using AutoMapper;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Mapping;

public class IdeaMappingProfile : Profile
{
    public IdeaMappingProfile()
    {
        CreateMap<Idea, IdeaDto>()
            .ForMember(d => d.CurrentUserInterest, opt => opt.Ignore());

        CreateMap<Idea, TrendingIdeaDto>()
            .ForMember(d => d.TrendingScore, opt => opt.Ignore())
            .ForMember(d => d.ViewsLast7Days, opt => opt.Ignore())
            .ForMember(d => d.InterestsLast7Days, opt => opt.Ignore())
            .ForMember(d => d.ConnectionsLast7Days, opt => opt.Ignore())
            .ForMember(d => d.CurrentUserInterest, opt => opt.Ignore());

        CreateMap<Idea, RecommendedIdeaDto>()
            .ForMember(d => d.MatchScore, opt => opt.Ignore())
            .ForMember(d => d.MatchReasons, opt => opt.Ignore())
            .ForMember(d => d.AiScore, opt => opt.Ignore())
            .ForMember(d => d.AiReason, opt => opt.Ignore())
            .ForMember(d => d.CurrentUserInterest, opt => opt.Ignore());
    }
}
