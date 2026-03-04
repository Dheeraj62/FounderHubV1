using System;

namespace FounderHub.Application.DTOs.IdeaVersions
{
    public class IdeaVersionDto
    {
        public string Id { get; set; } = string.Empty;
        public string IdeaId { get; set; } = string.Empty;
        public int VersionNumber { get; set; }
        public string Problem { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty;
        public string WhatChanged { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateVersionRequest
    {
        public string Problem { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty;
        public string WhatChanged { get; set; } = string.Empty;
    }
}
