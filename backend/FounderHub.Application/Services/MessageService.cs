using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FounderHub.Application.DTOs.Messages;
using FounderHub.Application.Interfaces;
using FounderHub.Domain.Entities;

namespace FounderHub.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepo;
        private readonly IConnectionRepository _connectionRepo;
        private readonly INotificationRepository _notificationRepo;
        private readonly IHtmlSanitizerService _sanitizer;

        public MessageService(IMessageRepository messageRepo, IConnectionRepository connectionRepo, INotificationRepository notificationRepo, IHtmlSanitizerService sanitizer)
        {
            _messageRepo = messageRepo;
            _connectionRepo = connectionRepo;
            _notificationRepo = notificationRepo;
            _sanitizer = sanitizer;
        }

        public async Task SendMessageAsync(string senderId, SendMessageRequest request)
        {
            var connection = await _connectionRepo.GetByIdAsync(request.ConnectionId);
            if (connection == null || connection.Status != "Accepted")
                throw new Exception("You must be connected to send a message");

            if (connection.FounderId != senderId && connection.InvestorId != senderId)
                throw new UnauthorizedAccessException();

            var message = new Message
            {
                ConnectionId = request.ConnectionId,
                SenderId = senderId,
                RecipientId = request.RecipientId,
                Content = _sanitizer.Sanitize(request.Content),
                SentAt = DateTime.UtcNow
            };

            await _messageRepo.CreateAsync(message);

            // Create notification
            await _notificationRepo.CreateAsync(new Notification
            {
                UserId = request.RecipientId,
                Type = "NewMessage",
                Title = "New Message",
                Body = "You have received a new message.",
                ReferenceId = connection.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task<IEnumerable<MessageDto>> GetThreadAsync(string userId, string connectionId)
        {
            var connection = await _connectionRepo.GetByIdAsync(connectionId);
            if (connection == null || (connection.FounderId != userId && connection.InvestorId != userId))
                throw new UnauthorizedAccessException();

            var messages = await _messageRepo.GetByConnectionIdAsync(connectionId);
            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                ConnectionId = m.ConnectionId,
                SenderId = m.SenderId,
                RecipientId = m.RecipientId,
                Content = m.Content,
                IsRead = m.IsRead,
                SentAt = m.SentAt
            }).OrderBy(m => m.SentAt);
        }
    }
}
