using System.Collections.Generic;
using System.Threading.Tasks;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Infrastructure.Data;
using MongoDB.Driver;

namespace FounderHub.Infrastructure.Repositories
{
    public class MeetingRepository : IMeetingRepository
    {
        private readonly MongoDbContext _context;

        public MeetingRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Meeting>> GetByInvestorIdAsync(string investorId)
        {
            return await _context.Meetings.Find(m => m.RequestedByInvestorId == investorId).ToListAsync();
        }

        public async Task<IEnumerable<Meeting>> GetByFounderIdAsync(string founderId)
        {
            return await _context.Meetings.Find(m => m.FounderId == founderId).ToListAsync();
        }

        public async Task<Meeting?> GetByIdAsync(string id)
        {
            return await _context.Meetings.Find(m => m.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Meeting meeting)
        {
            await _context.Meetings.InsertOneAsync(meeting);
        }

        public async Task UpdateAsync(Meeting meeting)
        {
            await _context.Meetings.ReplaceOneAsync(m => m.Id == meeting.Id, meeting);
        }
    }
}
