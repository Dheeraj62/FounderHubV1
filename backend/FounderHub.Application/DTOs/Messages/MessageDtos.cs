using System;

namespace FounderHub.Application.DTOs.Messages
{
    public class MessageDto
    {
        public string Id { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string RecipientId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class SendMessageRequest
    {
        public string ConnectionId { get; set; } = string.Empty;
        public string RecipientId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
