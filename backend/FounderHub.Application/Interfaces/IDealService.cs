using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Deals;

namespace FounderHub.Application.Interfaces
{
    public interface IDealService
    {
        Task<List<DealDto>> GetInvestorDealsAsync(string investorId);
        Task<DealDto> CreateDealAsync(string investorId, CreateDealRequest request);
        Task<DealDto> UpdateDealAsync(string investorId, string dealId, UpdateDealRequest request);
        Task DeleteDealAsync(string investorId, string dealId);
    }
}
