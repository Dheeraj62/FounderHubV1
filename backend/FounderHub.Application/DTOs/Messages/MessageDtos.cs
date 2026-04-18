using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Messages
{
    /// <summary>
    /// Response DTO for messages — never exposes ConnectionId or ReceiverId to clients.
    /// </summary>
    public class MessageResponse
    {
        public string Id { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Request DTO for sending a message. ReceiverId is auto-determined server-side from the connection.
    /// </summary>
    public class SendMessageRequest
    {
        [Required]
        public string ConnectionId { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "Message cannot be empty.")]
        [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}
