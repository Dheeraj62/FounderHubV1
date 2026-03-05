using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Follows;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class FollowService : IFollowService
    {
        private static readonly HashSet<string> AllowedTypes =
            new(StringComparer.OrdinalIgnoreCase) { "FOUNDER", "INVESTOR", "IDEA" };

        private readonly IFollowRepository _follows;

        public FollowService(IFollowRepository follows)
        {
            _follows = follows;
        }

        public async Task FollowAsync(string followerId, FollowRequest request)
        {
            var type = (request.Type ?? string.Empty).Trim().ToUpperInvariant();
            if (!AllowedTypes.Contains(type))
                throw new Exception("Invalid follow type. Must be FOUNDER, INVESTOR, or IDEA.");

            if ((type == "FOUNDER" || type == "INVESTOR") && request.FollowingId == followerId)
                throw new Exception("You cannot follow yourself.");

            var existing = await _follows.GetAsync(followerId, request.FollowingId, type);
            if (existing != null) return; // idempotent

            await _follows.CreateAsync(new Follow
            {
                FollowerId = followerId,
                FollowingId = request.FollowingId,
                Type = type,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task UnfollowAsync(string followerId, FollowRequest request)
        {
            var type = (request.Type ?? string.Empty).Trim().ToUpperInvariant();
            if (!AllowedTypes.Contains(type))
                throw new Exception("Invalid follow type. Must be FOUNDER, INVESTOR, or IDEA.");

            await _follows.DeleteAsync(followerId, request.FollowingId, type);
        }

        public async Task<IEnumerable<FollowDto>> GetFollowingAsync(string followerId, string? type = null)
        {
            var normalizedType = string.IsNullOrWhiteSpace(type) ? null : type.Trim().ToUpperInvariant();
            var items = await _follows.GetFollowingAsync(followerId, normalizedType);
            return items.Select(Map);
        }

        public async Task<IEnumerable<FollowDto>> GetFollowersAsync(string followingId, string? type = null)
        {
            var normalizedType = string.IsNullOrWhiteSpace(type) ? null : type.Trim().ToUpperInvariant();
            var items = await _follows.GetFollowersAsync(followingId, normalizedType);
            return items.Select(Map);
        }

        private static FollowDto Map(Follow f) => new()
        {
            Id = f.Id,
            FollowerId = f.FollowerId,
            FollowingId = f.FollowingId,
            Type = f.Type,
            CreatedAt = f.CreatedAt
        };
    }
}

