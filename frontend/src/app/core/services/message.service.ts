import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, SendMessageRequest } from '../models/message.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private baseUrl = `${API_CONFIG.baseUrl}/messages`;

    constructor(private http: HttpClient) { }

    getThread(connectionId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.baseUrl}/${connectionId}`);
    }

    sendMessage(request: SendMessageRequest): Observable<void> {
        return this.http.post<void>(this.baseUrl, request);
    }
}
