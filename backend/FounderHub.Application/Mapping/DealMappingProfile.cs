using AutoMapper;
using FounderHub.Application.DTOs.Deals;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Mapping;

public class DealMappingProfile : Profile
{
    public DealMappingProfile()
    {
        CreateMap<InvestorDeal, DealDto>()
            .ForMember(d => d.IdeaTitle, opt => opt.Ignore())
            .ForMember(d => d.FounderName, opt => opt.Ignore());
    }
}
