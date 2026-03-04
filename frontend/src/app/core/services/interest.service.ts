import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpressInterestRequest, InterestCount } from '../models/interest.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class InterestService {
    private baseUrl = `${API_CONFIG.baseUrl}/ideas`;

    constructor(private http: HttpClient) { }

    expressInterest(ideaId: string, request: ExpressInterestRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/${ideaId}/interest`, request);
    }

    getInterestCount(ideaId: string): Observable<InterestCount> {
        return this.http.get<InterestCount>(`${this.baseUrl}/${ideaId}/interest/count`);
    }
}
