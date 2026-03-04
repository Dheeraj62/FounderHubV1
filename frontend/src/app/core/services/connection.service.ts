import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Connection, SendConnectionRequest } from '../models/connection.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    private baseUrl = `${API_CONFIG.baseUrl}/connections`;

    constructor(private http: HttpClient) { }

    getMyConnections(): Observable<Connection[]> {
        return this.http.get<Connection[]>(this.baseUrl);
    }

    sendRequest(request: SendConnectionRequest): Observable<void> {
        return this.http.post<void>(this.baseUrl, request);
    }

    acceptRequest(connectionId: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${connectionId}/accept`, {});
    }

    rejectRequest(connectionId: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${connectionId}/reject`, {});
    }
}
