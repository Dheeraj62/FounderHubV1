export interface Message {
    id: string;
    connectionId: string;
    senderId: string;
    recipientId: string;
    content: string;
    isRead: boolean;
    sentAt: string;
}

export interface SendMessageRequest {
    connectionId: string;
    recipientId: string;
    content: string;
}
