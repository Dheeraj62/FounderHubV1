export interface Connection {
    id: string;
    founderId: string;
    investorId: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    createdAt: string;
    updatedAt: string;
    partnerUsername: string;
    partnerRole: string;
}

export interface SendConnectionRequest {
    founderId: string;
}
