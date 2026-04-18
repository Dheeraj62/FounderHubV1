import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, SendMessageRequest } from '../models/message.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private baseUrl = `${API_CONFIG.baseUrl}/messages`;

    constructor(private http: HttpClient) { }

    getThread(connectionId: string, page: number = 1, pageSize: number = 50): Observable<Message[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        return this.http.get<Message[]>(`${this.baseUrl}/${connectionId}`, { params });
    }

    sendMessage(request: SendMessageRequest): Observable<void> {
        return this.http.post<void>(this.baseUrl, request);
    }

    markAsRead(connectionId: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${connectionId}/read`, {});
    }
}
