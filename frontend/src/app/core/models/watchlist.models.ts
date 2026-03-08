export interface Watchlist {
    ideaId: string;
    notes?: string;
    createdAt: string;
    ideaTitle: string;
    ideaIndustry: string;
    ideaStage: string;
    founderName: string;
}

export interface AddToWatchlistRequest {
    ideaId: string;
    notes?: string;
}
