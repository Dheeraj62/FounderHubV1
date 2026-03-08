export interface Deal {
    id: string;
    investorId: string;
    ideaId: string;
    stage: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;

    // Hydrated properties
    ideaTitle?: string;
    founderName?: string;
}

export interface CreateDealRequest {
    ideaId: string;
    stage?: string;
    notes?: string;
}

export interface UpdateDealRequest {
    stage: string;
    notes?: string;
}

export const DEAL_STAGES = [
    'Saved',
    'Reviewing',
    'Contacted',
    'MeetingScheduled',
    'Interested',
    'Passed'
];
