using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;

namespace FounderHub.Application.Interfaces
{
    public interface IAIMatchService
    {
        /// <summary>
        /// Calls the Python FastAPI microservice to get AI-ranked matches.
        /// Returns null if the AI service is unavailable (to trigger fallback).
        /// </summary>
        Task<List<AiMatchResultDto>?> GetAiMatchesAsync(string investorId);
    }
}
