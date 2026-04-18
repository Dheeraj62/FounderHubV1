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

        /// <summary>
        /// The username of the other participant (resolved server-side for the requesting user).
        /// </summary>
        public string PartnerUsername { get; set; } = string.Empty;

        /// <summary>
        /// The role of the other participant (Founder or Investor).
        /// </summary>
        public string PartnerRole { get; set; } = string.Empty;
    }

    public class SendConnectionRequest
    {
        public string FounderId { get; set; } = string.Empty;
    }
}
