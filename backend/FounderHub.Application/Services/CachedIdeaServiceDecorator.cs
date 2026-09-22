using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Ideas;
using FounderHub.Application.Interfaces;

namespace FounderHub.Application.Services;

/// <summary>
/// Decorator Pattern: wraps IIdeaService to add caching for
/// expensive read operations. Write operations invalidate relevant caches.
/// </summary>
public class CachedIdeaServiceDecorator : IIdeaService
{
    private readonly IIdeaService _inner;
    private readonly ICacheService _cache;
    private static readonly TimeSpan TrendingTtl = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan RecommendedTtl = TimeSpan.FromMinutes(10);

    public CachedIdeaServiceDecorator(IIdeaService inner, ICacheService cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<IEnumerable<TrendingIdeaDto>> GetTrendingAsync(int limit = 10, string? currentUserId = null)
    {
        var cacheKey = $"trending:{limit}:{currentUserId ?? "anon"}";
        var cached = await _cache.GetAsync<List<TrendingIdeaDto>>(cacheKey);
        if (cached != null) return cached;

        var result = (await _inner.GetTrendingAsync(limit, currentUserId)).ToList();
        await _cache.SetAsync(cacheKey, result, TrendingTtl);
        return result;
    }

    public async Task<IEnumerable<RecommendedIdeaDto>> GetRecommendedAsync(string investorId)
    {
        var cacheKey = $"recommended:{investorId}";
        var cached = await _cache.GetAsync<List<RecommendedIdeaDto>>(cacheKey);
        if (cached != null) return cached;

        var result = (await _inner.GetRecommendedAsync(investorId)).ToList();
        await _cache.SetAsync(cacheKey, result, RecommendedTtl);
        return result;
    }

    // Write operations: invalidate cache then delegate
    public async Task<IdeaDto> CreateIdeaAsync(string founderId, CreateIdeaRequest request)
    {
        var result = await _inner.CreateIdeaAsync(founderId, request);
        await _cache.RemoveByPrefixAsync("trending:");
        return result;
    }

    public async Task<IdeaDto> UpdateIdeaAsync(string founderId, string ideaId, UpdateIdeaRequest request)
    {
        var result = await _inner.UpdateIdeaAsync(founderId, ideaId, request);
        await _cache.RemoveByPrefixAsync("trending:");
        await _cache.RemoveAsync($"idea:{ideaId}");
        return result;
    }

    public async Task DeleteIdeaAsync(string founderId, string ideaId)
    {
        await _inner.DeleteIdeaAsync(founderId, ideaId);
        await _cache.RemoveByPrefixAsync("trending:");
        await _cache.RemoveAsync($"idea:{ideaId}");
    }

    // Read-through operations: delegate directly
    public Task<IdeaDto?> GetIdeaByIdAsync(string ideaId, string? currentUserId = null)
        => _inner.GetIdeaByIdAsync(ideaId, currentUserId);

    public Task<IEnumerable<IdeaDto>> GetMyIdeasAsync(string founderId)
        => _inner.GetMyIdeasAsync(founderId);

    public Task<PaginatedResult<IdeaDto>> GetIdeasAsync(string? stage, string? industry, bool? previouslyRejected, string? location, string? keyword, int page, int pageSize, string? currentUserId = null)
        => _inner.GetIdeasAsync(stage, industry, previouslyRejected, location, keyword, page, pageSize, currentUserId);
}
