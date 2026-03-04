export interface InterestCount {
    interestedCount: number;
    maybeCount: number;
}

export interface ExpressInterestRequest {
    status: 'Interested' | 'HighlyInterested' | 'Maybe' | 'Pass';
}
