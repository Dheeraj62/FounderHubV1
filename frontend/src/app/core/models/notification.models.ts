export interface Notification {
    id: string;
    userId: string;
    type: 'ConnectionRequest' | 'ConnectionAccepted' | 'NewInterest' | 'NewMessage';
    title: string;
    body: string;
    referenceId?: string;
    isRead: boolean;
    createdAt: string;
}
