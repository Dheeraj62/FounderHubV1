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
    gitHubUrl?: string;
    twitterUrl?: string;
    website?: string;
    currentStartup: string;
    startupStage: string;
    skills: string[];
    industries: string[];
    lookingFor: string[];
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
    gitHubUrl?: string;
    twitterUrl?: string;
    website?: string;
    currentStartup: string;
    startupStage: string;
    skills: string[];
    industries: string[];
    lookingFor: string[];
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
    position?: string;
    investmentThesis?: string;
    averageTicketSize?: string;
    portfolioCompanies: string[];
    angelListProfile?: string;
    website?: string;
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
    position?: string;
    investmentThesis?: string;
    averageTicketSize?: string;
    portfolioCompanies: string[];
    angelListProfile?: string;
    website?: string;
    linkedInVerified: boolean;
    linkedInProfileUrl?: string;
}

export interface PublicFounderProfile {
    userId: string;
    username: string;
    fullName: string;
    headline: string;
    profilePictureUrl?: string;
    coverImageUrl?: string;
    linkedInVerified: boolean;
    emailVerified: boolean;
    reputationScore: number;
    joinedAt: string;

    bio: string;
    location: string;
    currentStartup: string;
    startupStage: string;
    technicalFounder: boolean;
    previousStartupCount: number;
    domainExperienceYears: number;
    teamSize: number;
    skills: string[];
    industries: string[];
    lookingFor: string[];

    startupWebsite?: string;
    gitHubUrl?: string;
    twitterUrl?: string;
    website?: string;
    linkedInProfileUrl?: string;

    followerCount: number;
    followingCount: number;
    ideaCount: number;
    totalProfileViews: number;
    totalIdeaViews: number;
    investorInterestCount: number;

    profileCompletionPercent: number;
}

export interface PublicInvestorProfile {
    userId: string;
    username: string;
    fullName: string;
    headline: string;
    profilePictureUrl?: string;
    coverImageUrl?: string;
    linkedInVerified: boolean;
    emailVerified: boolean;
    reputationScore: number;
    joinedAt: string;

    bio: string;
    location: string;
    investmentFirm?: string;
    position?: string;
    investmentThesis?: string;
    averageTicketSize?: string;
    ticketSizeRange: string;
    investmentStage: string;
    preferredIndustries: string[];
    preferredStages: string[];
    portfolioCompanies: string[];

    angelListProfile?: string;
    website?: string;
    linkedInProfileUrl?: string;

    followerCount: number;
    followingCount: number;
    companiesInvested: number;

    profileCompletionPercent: number;
}

export interface UpdateUserProfileRequest {
    fullName: string;
    headline: string;
}

export interface ProfileCompletion {
    percent: number;
    missingFields: string[];
}
