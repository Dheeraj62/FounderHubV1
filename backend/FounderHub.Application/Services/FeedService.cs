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
            
            // Batch-fetch all referenced entities
            var allUserIds = events.Select(e => e.UserId).Distinct().ToList();
            // Add idea founder IDs later
            var ideaRefIds = events.Where(e => e.Type is "IDEA_CREATED" or "IDEA_UPDATED" or "TRENDING_IDEA")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            var updateRefIds = events.Where(e => e.Type == "FOUNDER_UPDATE")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            var interestRefIds = events.Where(e => e.Type == "INTEREST_EVENT")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            
            // Fetch ideas by IDs (for IDEA_ events and also for INTEREST events after resolving)
            var ideas = (await _ideas.GetByIdsAsync(ideaRefIds)).ToDictionary(i => i.Id);
            
            // For interest events, we need to fetch interests first, then their ideas
            var interestEntities = new Dictionary<string, Interest>();
            foreach (var iid in interestRefIds)
            {
                var interest = await _interests.GetByIdAsync(iid);
                if (interest != null) interestEntities[iid] = interest;
            }
            var interestIdeaIds = interestEntities.Values.Select(i => i.IdeaId).Except(ideas.Keys).Distinct().ToList();
            if (interestIdeaIds.Any())
            {
                foreach (var idea in await _ideas.GetByIdsAsync(interestIdeaIds))
                    ideas.TryAdd(idea.Id, idea);
            }
            
            // Collect all founder IDs from ideas + event actors
            var additionalUserIds = ideas.Values.Select(i => i.FounderId).Distinct();
            allUserIds = allUserIds.Concat(additionalUserIds).Distinct().ToList();
            var users = await _users.GetByIdsAsync(allUserIds);
            
            // Fetch updates
            var updates = new Dictionary<string, FounderUpdate>();
            foreach (var uid in updateRefIds)
            {
                var update = await _updates.GetByIdAsync(uid);
                if (update != null) updates[uid] = update;
            }
            
            // Map events
            var items = new List<FeedItemDto>(events.Count);
            foreach (var e in events)
            {
                var item = MapEvent(e, users, ideas, updates, interestEntities);
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
            
            // Batch-fetch all referenced entities for following feed
            var allUserIds = events.Select(e => e.UserId).Distinct().ToList();
            var ideaRefIds = events.Where(e => e.Type is "IDEA_CREATED" or "IDEA_UPDATED" or "TRENDING_IDEA")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            var updateRefIds = events.Where(e => e.Type == "FOUNDER_UPDATE")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            var interestRefIds = events.Where(e => e.Type == "INTEREST_EVENT")
                .Where(e => !string.IsNullOrWhiteSpace(e.ReferenceId))
                .Select(e => e.ReferenceId!).Distinct().ToList();
            
            var ideas = (await _ideas.GetByIdsAsync(ideaRefIds)).ToDictionary(i => i.Id);
            
            var interestEntities = new Dictionary<string, Interest>();
            foreach (var iid in interestRefIds)
            {
                var interest = await _interests.GetByIdAsync(iid);
                if (interest != null) interestEntities[iid] = interest;
            }
            var interestIdeaIds = interestEntities.Values.Select(i => i.IdeaId).Except(ideas.Keys).Distinct().ToList();
            if (interestIdeaIds.Any())
            {
                foreach (var idea in await _ideas.GetByIdsAsync(interestIdeaIds))
                    ideas.TryAdd(idea.Id, idea);
            }
            
            var additionalUserIds = ideas.Values.Select(i => i.FounderId).Distinct();
            allUserIds = allUserIds.Concat(additionalUserIds).Distinct().ToList();
            var users = await _users.GetByIdsAsync(allUserIds);
            
            var updates = new Dictionary<string, FounderUpdate>();
            foreach (var uid in updateRefIds)
            {
                var update = await _updates.GetByIdAsync(uid);
                if (update != null) updates[uid] = update;
            }
            
            var result = new List<FeedItemDto>();

            foreach (var e in events)
            {
                if (result.Count >= pageSize * page) break;

                var item = MapEvent(e, users, ideas, updates, interestEntities);
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

        private FeedItemDto? MapEvent(
            FeedEvent e,
            Dictionary<string, User> users,
            Dictionary<string, Idea> ideas,
            Dictionary<string, FounderUpdate> updates,
            Dictionary<string, Interest> interests)
        {
            var actor = users.GetValueOrDefault(e.UserId);
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
                    var idea = ideas.GetValueOrDefault(e.ReferenceId);
                    if (idea == null) return null;
                    var founder = users.GetValueOrDefault(idea.FounderId);
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
                    var update = updates.GetValueOrDefault(e.ReferenceId);
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
                    var interest = interests.GetValueOrDefault(e.ReferenceId);
                    if (interest == null) return null;
                    var idea = ideas.GetValueOrDefault(interest.IdeaId);
                    if (idea == null) return null;
                    var founder = users.GetValueOrDefault(idea.FounderId);
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

