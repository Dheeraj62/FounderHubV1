import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private baseUrl = `${API_CONFIG.baseUrl}/notifications`;

    constructor(private http: HttpClient) { }

    getMyNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.baseUrl);
    }

    markAsRead(id: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}/read`, {});
    }

    markAllAsRead(): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/read-all`, {});
    }
}
