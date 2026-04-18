using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Messages;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace FounderHub.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepo;
        private readonly IConnectionRepository _connectionRepo;
        private readonly INotificationRepository _notificationRepo;
        private readonly IHtmlSanitizerService _sanitizer;
        private readonly ILogger<MessageService> _logger;

        private const int MaxPageSize = 50;
        private const int DefaultPageSize = 20;

        public MessageService(
            IMessageRepository messageRepo,
            IConnectionRepository connectionRepo,
            INotificationRepository notificationRepo,
            IHtmlSanitizerService sanitizer,
            ILogger<MessageService> logger)
        {
            _messageRepo = messageRepo;
            _connectionRepo = connectionRepo;
            _notificationRepo = notificationRepo;
            _sanitizer = sanitizer;
            _logger = logger;
        }

        public async Task SendMessageAsync(string userId, SendMessageRequest request)
        {
            var connection = await ValidateConnectionAccessAsync(userId, request.ConnectionId);

            // Auto-determine receiver from connection
            var receiverId = connection.FounderId == userId
                ? connection.InvestorId
                : connection.FounderId;

            var cleanContent = _sanitizer.Sanitize(request.Content);

            if (string.IsNullOrWhiteSpace(cleanContent))
                throw new ArgumentException("Message content is invalid after sanitization.");

            var message = new Message
            {
                ConnectionId = request.ConnectionId,
                SenderId = userId,
                ReceiverId = receiverId,
                Content = cleanContent,
                CreatedAt = DateTime.UtcNow
            };

            await _messageRepo.AddAsync(message);

            // Create notification for receiver
            await _notificationRepo.CreateAsync(new Notification
            {
                UserId = receiverId,
                Type = "NewMessage",
                Title = "New Message",
                Body = "You have received a new message.",
                ReferenceId = connection.Id,
                CreatedAt = DateTime.UtcNow
            });

            _logger.LogInformation(
                "Message sent: ConnectionId={ConnectionId}, SenderId={SenderId}, ReceiverId={ReceiverId}",
                request.ConnectionId, userId, receiverId);
        }

        public async Task<List<MessageResponse>> GetMessagesAsync(string userId, string connectionId, int page, int pageSize)
        {
            await ValidateConnectionAccessAsync(userId, connectionId);

            // Enforce pagination bounds
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = DefaultPageSize;
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            var skip = (page - 1) * pageSize;
            var messages = await _messageRepo.GetByConnectionIdAsync(connectionId, skip, pageSize);

            return messages.Select(MapToResponse).ToList();
        }

        public async Task MarkAsReadAsync(string userId, string connectionId)
        {
            await ValidateConnectionAccessAsync(userId, connectionId);

            // Mark messages where current user is the receiver
            await _messageRepo.MarkAsReadAsync(connectionId, userId);

            _logger.LogInformation(
                "Messages marked as read: ConnectionId={ConnectionId}, UserId={UserId}",
                connectionId, userId);
        }

        /// <summary>
        /// Reusable connection validation — ensures connection exists, is accepted,
        /// and the requesting user is a participant.
        /// </summary>
        private async Task<Connection> ValidateConnectionAccessAsync(string userId, string connectionId)
        {
            var connection = await _connectionRepo.GetByIdAsync(connectionId);

            if (connection == null)
                throw new ArgumentException("Connection not found.");

            if (connection.Status != "Accepted")
                throw new ArgumentException("You must be connected to exchange messages.");

            if (connection.FounderId != userId && connection.InvestorId != userId)
                throw new UnauthorizedAccessException("User not part of this conversation.");

            return connection;
        }

        private static MessageResponse MapToResponse(Message m) => new()
        {
            Id = m.Id,
            SenderId = m.SenderId,
            Content = m.Content,
            IsRead = m.IsRead,
            CreatedAt = m.CreatedAt
        };
    }
}
