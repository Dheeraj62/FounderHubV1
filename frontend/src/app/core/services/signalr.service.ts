import { Injectable, inject, OnDestroy } from '@angular/core';
import { HubConnectionBuilder, HubConnection, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface RealtimeNotification {
    type: string;
    data: any;
}

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
    private notificationHub: HubConnection | null = null;
    private chatHub: HubConnection | null = null;
    private authService = inject(AuthService);

    /** Emits whenever the server pushes a notification */
    notifications$ = new Subject<RealtimeNotification>();

    /** Emits whenever a new chat message arrives on the active connection */
    messages$ = new Subject<any>();

    /** Emits meeting updates */
    meetingUpdates$ = new Subject<any>();

    async connectNotifications(): Promise<void> {
        if (this.notificationHub?.state === HubConnectionState.Connected) return;

        const token = this.authService.getToken();
        if (!token) return;

        this.notificationHub = new HubConnectionBuilder()
            .withUrl(`${API_CONFIG.hubUrl}/hubs/notifications`, {
                accessTokenFactory: () => this.authService.getToken() || ''
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(LogLevel.Warning)
            .build();

        this.notificationHub.on('ReceiveNotification', (payload: RealtimeNotification) => {
            this.notifications$.next(payload);
        });

        this.notificationHub.on('MeetingUpdate', (payload: any) => {
            this.meetingUpdates$.next(payload);
        });

        try {
            await this.notificationHub.start();
            console.log('[SignalR] Notification hub connected.');
        } catch (err) {
            console.error('[SignalR] Failed to connect notification hub:', err);
        }
    }

    async connectChat(connectionId: string): Promise<void> {
        const token = this.authService.getToken();
        if (!token) return;

        if (!this.chatHub || this.chatHub.state !== HubConnectionState.Connected) {
            this.chatHub = new HubConnectionBuilder()
                .withUrl(`${API_CONFIG.hubUrl}/hubs/chat`, {
                    accessTokenFactory: () => this.authService.getToken() || ''
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Warning)
                .build();

            this.chatHub.on('ReceiveMessage', (message: any) => {
                this.messages$.next(message);
            });

            await this.chatHub.start();
        }

        await this.chatHub.invoke('JoinConnection', connectionId);
        console.log(`[SignalR] Joined chat connection: ${connectionId}`);
    }

    async leaveChat(connectionId: string): Promise<void> {
        if (this.chatHub?.state === HubConnectionState.Connected) {
            await this.chatHub.invoke('LeaveConnection', connectionId);
        }
    }

    async disconnect(): Promise<void> {
        if (this.notificationHub) {
            await this.notificationHub.stop();
            this.notificationHub = null;
        }
        if (this.chatHub) {
            await this.chatHub.stop();
            this.chatHub = null;
        }
    }

    ngOnDestroy(): void {
        this.disconnect();
        this.notifications$.complete();
        this.messages$.complete();
        this.meetingUpdates$.complete();
    }
}
