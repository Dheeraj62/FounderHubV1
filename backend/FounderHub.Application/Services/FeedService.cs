using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Feed;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class FeedService : IFeedService
    {
        private readonly IFeedEventRepository _feedEvents;
        private readonly IUserRepository _users;
        private readonly IIdeaRepository _ideas;
        private readonly IFounderUpdateRepository _updates;
        private readonly IInterestRepository _interests;
        private readonly IFollowRepository _follows;
        private readonly IIdeaService _ideaService;

        public FeedService(
            IFeedEventRepository feedEvents,
            IUserRepository users,
            IIdeaRepository ideas,
            IFounderUpdateRepository updates,
            IInterestRepository interests,
            IFollowRepository follows,
            IIdeaService ideaService)
        {
            _feedEvents = feedEvents;
            _users = users;
            _ideas = ideas;
            _updates = updates;
            _interests = interests;
            _follows = follows;
            _ideaService = ideaService;
        }

        public async Task<IEnumerable<FeedItemDto>> GetGlobalFeedAsync(string userId, int page = 1, int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 20;

            var skip = (page - 1) * pageSize;
            var events = (await _feedEvents.GetLatestAsync(skip, pageSize)).ToList();

            var items = new List<FeedItemDto>(events.Count);
            foreach (var e in events)
            {
                var item = await MapEventAsync(e);
                if (item != null) items.Add(item);
            }
            return items;
        }

        public async Task<IEnumerable<FeedItemDto>> GetFollowingFeedAsync(string userId, int page = 1, int pageSize = 20)
        {
            // Simple approach: pull a bigger slice of global feed and filter by following.
            var following = (await _follows.GetFollowingAsync(userId)).ToList();
            var followedUsers = new HashSet<string>(
                following.Where(f => f.Type == "FOUNDER" || f.Type == "INVESTOR").Select(f => f.FollowingId));
            var followedIdeas = new HashSet<string>(following.Where(f => f.Type == "IDEA").Select(f => f.FollowingId));

            var events = (await _feedEvents.GetLatestAsync(0, 200)).ToList();
            var result = new List<FeedItemDto>();

            foreach (var e in events)
            {
                if (result.Count >= pageSize * page) break;

                var item = await MapEventAsync(e);
                if (item == null) continue;

                var include = followedUsers.Contains(item.Actor.UserId);
                if (!include && item.Idea != null)
                {
                    include = followedIdeas.Contains(item.Idea.Id) || followedUsers.Contains(item.Idea.FounderId);
                }
                if (!include && item.Update != null)
                {
                    include = followedUsers.Contains(item.Update.FounderId);
                }

                if (include) result.Add(item);
            }

            // paginate in-memory
            var skip = (Math.Max(page, 1) - 1) * pageSize;
            return result.Skip(skip).Take(pageSize);
        }

        public async Task<IEnumerable<FeedItemDto>> GetTrendingFeedAsync(string userId, int limit = 10)
        {
            var trending = (await _ideaService.GetTrendingAsync(limit)).ToList();
            var items = new List<FeedItemDto>(trending.Count);

            foreach (var idea in trending)
            {
                var founder = await _users.GetByIdAsync(idea.FounderId);
                if (founder == null) continue;

                items.Add(new FeedItemDto
                {
                    Id = $"TRENDING:{idea.Id}",
                    Type = "TRENDING_IDEA",
                    CreatedAt = DateTime.UtcNow,
                    Actor = new FeedActorDto
                    {
                        UserId = founder.Id,
                        Username = founder.Username,
                        Role = founder.Role.ToString(),
                        LinkedInVerified = founder.LinkedInVerified
                    },
                    Idea = new FeedIdeaDto
                    {
                        Id = idea.Id,
                        FounderId = idea.FounderId,
                        FounderUsername = founder.Username,
                        Title = idea.Title,
                        Industry = idea.Industry,
                        Stage = idea.Stage,
                        PreviouslyRejected = idea.PreviouslyRejected
                    }
                });
            }

            return items;
        }

        private async Task<FeedItemDto?> MapEventAsync(FeedEvent e)
        {
            var actor = await _users.GetByIdAsync(e.UserId);
            if (actor == null) return null;

            var dto = new FeedItemDto
            {
                Id = e.Id,
                Type = e.Type,
                CreatedAt = e.CreatedAt,
                Actor = new FeedActorDto
                {
                    UserId = actor.Id,
                    Username = actor.Username,
                    Role = actor.Role.ToString(),
                    LinkedInVerified = actor.LinkedInVerified
                }
            };

            switch (e.Type)
            {
                case "IDEA_CREATED":
                case "IDEA_UPDATED":
                case "TRENDING_IDEA":
                {
                    if (string.IsNullOrWhiteSpace(e.ReferenceId)) return dto;
                    var idea = await _ideas.GetByIdAsync(e.ReferenceId);
                    if (idea == null) return null;
                    var founder = await _users.GetByIdAsync(idea.FounderId);
                    if (founder == null) return null;
                    dto.Idea = new FeedIdeaDto
                    {
                        Id = idea.Id,
                        FounderId = idea.FounderId,
                        FounderUsername = founder.Username,
                        Title = idea.Title,
                        Industry = idea.Industry,
                        Stage = idea.Stage,
                        PreviouslyRejected = idea.PreviouslyRejected
                    };
                    return dto;
                }
                case "FOUNDER_UPDATE":
                {
                    if (string.IsNullOrWhiteSpace(e.ReferenceId)) return dto;
                    var update = await _updates.GetByIdAsync(e.ReferenceId);
                    if (update == null) return null;
                    dto.Update = new FeedUpdateDto
                    {
                        Id = update.Id,
                        FounderId = update.FounderId,
                        FounderUsername = actor.Username,
                        Content = update.Content
                    };
                    return dto;
                }
                case "INTEREST_EVENT":
                {
                    if (string.IsNullOrWhiteSpace(e.ReferenceId)) return dto;
                    var interest = await _interests.GetByIdAsync(e.ReferenceId);
                    if (interest == null) return null;
                    var idea = await _ideas.GetByIdAsync(interest.IdeaId);
                    if (idea == null) return null;
                    var founder = await _users.GetByIdAsync(idea.FounderId);
                    if (founder == null) return null;
                    dto.InterestStatus = interest.Status.ToString();
                    dto.Idea = new FeedIdeaDto
                    {
                        Id = idea.Id,
                        FounderId = idea.FounderId,
                        FounderUsername = founder.Username,
                        Title = idea.Title,
                        Industry = idea.Industry,
                        Stage = idea.Stage,
                        PreviouslyRejected = idea.PreviouslyRejected
                    };
                    return dto;
                }
                case "NEW_FOUNDER":
                default:
                    return dto;
            }
        }
    }
}

