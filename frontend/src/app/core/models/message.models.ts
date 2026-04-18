export interface Message {
    id: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface SendMessageRequest {
    connectionId: string;
    content: string;
}
