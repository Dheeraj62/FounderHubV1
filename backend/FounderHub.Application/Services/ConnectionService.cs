using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Connections;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using FounderHub.Domain.Exceptions;

namespace FounderHub.Application.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly IConnectionRepository _connectionRepo;
        private readonly INotificationRepository _notificationRepo;
        private readonly IUserRepository _userRepo;

        public ConnectionService(IConnectionRepository connectionRepo, INotificationRepository notificationRepo, IUserRepository userRepo)
        {
            _connectionRepo = connectionRepo;
            _notificationRepo = notificationRepo;
            _userRepo = userRepo;
        }

        public async Task SendRequestAsync(string investorId, SendConnectionRequest request)
        {
            var existing = await _connectionRepo.GetConnectionAsync(request.FounderId, investorId);
            if (existing != null) throw new ConflictException("Connection already exists or is pending.");

            var connection = new Connection
            {
                FounderId = request.FounderId,
                InvestorId = investorId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _connectionRepo.CreateAsync(connection);

            // Create notification for founder
            await _notificationRepo.CreateAsync(new Notification
            {
                UserId = request.FounderId,
                Type = "ConnectionRequest",
                Title = "New Connection Request",
                Body = "An investor is interested in connecting with you.",
                ReferenceId = connection.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task AcceptRequestAsync(string userId, string connectionId)
        {
            var connection = await _connectionRepo.GetByIdAsync(connectionId);
            if (connection == null) throw new NotFoundException("Connection", connectionId);
            if (connection.FounderId != userId) throw new ForbiddenException("Only the founder can accept this connection.");

            connection.Status = "Accepted";
            connection.UpdatedAt = DateTime.UtcNow;
            await _connectionRepo.UpdateAsync(connection);

            // Create notification for investor
            await _notificationRepo.CreateAsync(new Notification
            {
                UserId = connection.InvestorId,
                Type = "ConnectionAccepted",
                Title = "Connection Accepted",
                Body = "A founder has accepted your connection request.",
                ReferenceId = connection.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task RejectRequestAsync(string userId, string connectionId)
        {
            var connection = await _connectionRepo.GetByIdAsync(connectionId);
            if (connection == null) throw new NotFoundException("Connection", connectionId);
            if (connection.FounderId != userId) throw new ForbiddenException("Only the founder can reject this connection.");

            connection.Status = "Rejected";
            connection.UpdatedAt = DateTime.UtcNow;
            await _connectionRepo.UpdateAsync(connection);
        }

        public async Task<IEnumerable<ConnectionDto>> GetMyConnectionsAsync(string userId)
        {
            var connections = await _connectionRepo.GetByUserIdAsync(userId);
            var connectionList = connections.ToList();
            var partnerIds = connectionList.Select(c => c.FounderId == userId ? c.InvestorId : c.FounderId).Distinct();
            var partners = await _userRepo.GetByIdsAsync(partnerIds);

            var result = new List<ConnectionDto>();

            foreach (var c in connectionList)
            {
                var partnerId = c.FounderId == userId ? c.InvestorId : c.FounderId;
                var partner = partners.GetValueOrDefault(partnerId);

                result.Add(new ConnectionDto
                {
                    Id = c.Id,
                    FounderId = c.FounderId,
                    InvestorId = c.InvestorId,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    PartnerUsername = partner?.Username ?? "Unknown",
                    PartnerRole = partner?.Role.ToString() ?? "Unknown"
                });
            }

            return result;
        }
    }
}
