using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class IdeaViewRepository : IIdeaViewRepository
    {
        private readonly MongoDbContext _context;

        public IdeaViewRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(IdeaView view)
        {
            await _context.IdeaViews.InsertOneAsync(view);
        }

        public async Task<int> GetIdeaViewCountAsync(string ideaId)
        {
            var count = await _context.IdeaViews.CountDocumentsAsync(v => v.IdeaId == ideaId);
            return (int)count;
        }

        public async Task<int> GetFounderTotalViewsAsync(string founderId)
        {
            var ideaIds = await _context.Ideas
                .Find(i => i.FounderId == founderId)
                .Project(i => i.Id)
                .ToListAsync();

            if (ideaIds.Count == 0) return 0;

            var filter = Builders<IdeaView>.Filter.In(v => v.IdeaId, ideaIds);
            var count = await _context.IdeaViews.CountDocumentsAsync(filter);
            return (int)count;
        }
    }
}

