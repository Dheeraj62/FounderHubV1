import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface PlatformStats {
    totalIdeas: number;
    totalFounders: number;
    totalInvestors: number;
    totalConnections: number;
}

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(private http: HttpClient) {}

    getPublicStats(): Observable<PlatformStats> {
        return this.http.get<PlatformStats>(`${API_CONFIG.baseUrl}/stats/public`);
    }
}
