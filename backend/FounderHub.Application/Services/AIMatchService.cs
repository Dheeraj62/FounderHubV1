using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FounderHub.Application.Services
{
    public class AIMatchService : IAIMatchService
    {
        private readonly HttpClient _httpClient;
        private readonly string _aiServiceBaseUrl;
        private readonly bool _isEnabled;
        private readonly ILogger<AIMatchService> _logger;

        public AIMatchService(HttpClient httpClient, IConfiguration configuration, ILogger<AIMatchService> logger)
        {
            _httpClient = httpClient;
            _aiServiceBaseUrl = configuration["AIService:BaseUrl"] ?? "http://localhost:8000";
            _isEnabled = configuration.GetValue<bool>("AIService:Enabled", true);
            _logger = logger;
        }

        public async Task<List<AiMatchResultDto>?> GetAiMatchesAsync(string investorId)
        {
            if (!_isEnabled)
            {
                return null; // Fallback immediately
            }
 
            try
            {
                var payload = JsonSerializer.Serialize(new { investorId });
                var content = new StringContent(payload, Encoding.UTF8, "application/json");
                
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(10));
                var response = await _httpClient.PostAsync($"{_aiServiceBaseUrl}/api/ai-matches", content, cts.Token);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("AI service returned {StatusCode} - falling back to rule-based matching.", response.StatusCode);
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                var results = JsonSerializer.Deserialize<List<AiMatchResultDto>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return results;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "AI match service unavailable - falling back to rule-based matching.");
                return null; // Signal caller to use fallback
            }
        }
    }
}
