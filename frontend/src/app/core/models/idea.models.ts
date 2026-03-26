export interface Idea {
    id: string;
    founderId: string;
    title: string;
    problem: string;
    solution: string;
    stage: string;
    industry: string;
    pitchDeckUrl?: string;
    demoUrl?: string;
    startupWebsite?: string;
    productImages?: string[];
    marketSize?: string;
    targetCustomers?: string;
    tractionMetrics?: string;
    previouslyRejected: boolean;
    rejectedBy?: string;
    rejectionReasonCategory?: string;
    whatChangedAfterRejection?: string;
    fundingRange?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
    currentUserInterest?: string;
}

export interface RecommendedIdea extends Idea {
    matchScore: number;
    matchReasons: string[];
    aiScore?: number;
    aiReason?: string;
}

export interface CreateIdeaRequest {
    title: string;
    problem: string;
    solution: string;
    stage: string;
    industry: string;
    pitchDeckUrl?: string;
    demoUrl?: string;
    startupWebsite?: string;
    productImages?: string[];
    marketSize?: string;
    targetCustomers?: string;
    tractionMetrics?: string;
    previouslyRejected: boolean;
    rejectedBy?: string;
    rejectionReasonCategory?: string;
    whatChangedAfterRejection?: string;
    fundingRange?: string;
}

export interface PaginatedIdeas {
    items: Idea[];
    totalCount: number;
    page: number;
    pageSize: number;
}
