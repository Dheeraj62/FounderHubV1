using System;

namespace FounderHub.Domain.Entities
{
    public class IdeaVersion
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string IdeaId { get; set; } = string.Empty;
        public int VersionNumber { get; set; }
        public string Problem { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty;
        public string WhatChanged { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
