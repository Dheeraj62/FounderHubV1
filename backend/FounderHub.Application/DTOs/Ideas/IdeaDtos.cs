using System;
using System.ComponentModel.DataAnnotations;

namespace FounderHub.Application.DTOs.Ideas
{
    public class CreateIdeaRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Problem { get; set; } = string.Empty;

        [Required]
        public string Solution { get; set; } = string.Empty;

        public string Stage { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public bool PreviouslyRejected { get; set; }
        public string? RejectedBy { get; set; }
        public string? RejectionReasonCategory { get; set; }
        public string? WhatChangedAfterRejection { get; set; }
        public string? FundingRange { get; set; }
        public string? Location { get; set; }
    }

    public class RecommendedIdeaDto : IdeaDto
    {
        public int MatchScore { get; set; }
        public List<string> MatchReasons { get; set; } = new();
    }

    public class UpdateIdeaRequest : CreateIdeaRequest
    {
    }

    public class IdeaDto : CreateIdeaRequest
    {
        public string Id { get; set; } = string.Empty;
        public string FounderId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class PaginatedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
