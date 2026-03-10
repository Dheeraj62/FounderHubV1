export interface FounderProfile {
    id: string;
    userId: string;
    technicalFounder: boolean;
    previousStartupCount: number;
    domainExperienceYears: number;
    teamSize: number;
    linkedInVerified: boolean;
    linkedInProfileUrl?: string;
    startupWebsite?: string;
    bio: string;
    location: string;
}

export interface UpsertFounderProfileRequest {
    technicalFounder: boolean;
    previousStartupCount: number;
    domainExperienceYears: number;
    teamSize: number;
    linkedInVerified: boolean;
    linkedInProfileUrl?: string;
    startupWebsite?: string;
    bio: string;
    location: string;
}

export interface InvestorProfile {
    id: string;
    userId: string;
    preferredIndustries: string[];
    preferredStages?: string[];
    preferredFundingRange?: string;
    preferredLocation?: string;
    preferredTeamSize?: string;
    investmentStage: string;
    ticketSizeRange: string;
    location: string;
    bio: string;
    investmentFirm?: string;
    portfolioCompanies: string[];
    angelListProfile?: string;
    linkedInVerified: boolean;
    linkedInProfileUrl?: string;
}

export interface UpsertInvestorProfileRequest {
    preferredIndustries: string[];
    preferredStages?: string[];
    preferredFundingRange?: string;
    preferredLocation?: string;
    preferredTeamSize?: string;
    investmentStage: string;
    ticketSizeRange: string;
    location: string;
    bio: string;
    investmentFirm?: string;
    portfolioCompanies: string[];
    angelListProfile?: string;
    linkedInVerified: boolean;
    linkedInProfileUrl?: string;
}
