export interface IdeaAnalytics {
    ideaId: string;
    ideaTitle: string;
    stage: string;
    industry: string;
    totalViews: number;
    highlyInterestedCount: number;
    maybeCount: number;
    passCount: number;
    createdAt: string;
}

export interface FounderAnalyticsSummary {
    totalIdeas: number;
    totalViews: number;
    totalHighlyInterested: number;
    totalMaybe: number;
    totalPass: number;
    ideaBreakdown: IdeaAnalytics[];
}
