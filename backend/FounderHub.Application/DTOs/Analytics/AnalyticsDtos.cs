using System;
using System.Collections.Generic;

namespace FounderHub.Application.DTOs.Analytics
{
    public class IdeaAnalyticsDto
    {
        public string IdeaId { get; set; } = string.Empty;
        public string IdeaTitle { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public int TotalViews { get; set; }
        public int HighlyInterestedCount { get; set; }
        public int MaybeCount { get; set; }
        public int PassCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class FounderAnalyticsSummaryDto
    {
        public int TotalIdeas { get; set; }
        public int TotalViews { get; set; }
        public int TotalHighlyInterested { get; set; }
        public int TotalMaybe { get; set; }
        public int TotalPass { get; set; }
        public List<IdeaAnalyticsDto> IdeaBreakdown { get; set; } = new();
    }
}
