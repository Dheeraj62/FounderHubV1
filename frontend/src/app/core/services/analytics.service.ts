import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FounderAnalyticsSummary } from '../models/analytics.models';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/Analytics`;

    constructor(private http: HttpClient) { }

    getMyAnalytics(): Observable<FounderAnalyticsSummary> {
        return this.http.get<FounderAnalyticsSummary>(`${this.apiUrl}/my`);
    }
}
