using System;

namespace FounderHub.Application.DTOs.Connections
{
    public class ConnectionDto
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public string InvestorId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class SendConnectionRequest
    {
        public string FounderId { get; set; } = string.Empty;
    }
}
