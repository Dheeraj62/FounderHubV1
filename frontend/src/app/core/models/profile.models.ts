export interface FounderProfile {
    id: string;
    userId: string;
    technicalFounder: boolean;
    previousStartupCount: number;
    domainExperienceYears: number;
    teamSize: number;
    linkedInVerified: boolean;
    bio: string;
    location: string;
}

export interface UpsertFounderProfileRequest {
    technicalFounder: boolean;
    previousStartupCount: number;
    domainExperienceYears: number;
    teamSize: number;
    linkedInVerified: boolean;
    bio: string;
    location: string;
}

export interface InvestorProfile {
    id: string;
    userId: string;
    preferredIndustries: string[];
    investmentStage: string;
    ticketSizeRange: string;
    location: string;
    bio: string;
}

export interface UpsertInvestorProfileRequest {
    preferredIndustries: string[];
    investmentStage: string;
    ticketSizeRange: string;
    location: string;
    bio: string;
}
