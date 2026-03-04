import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FounderProfile, InvestorProfile, UpsertFounderProfileRequest, UpsertInvestorProfileRequest } from '../models/profile.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private baseUrl = `${API_CONFIG.baseUrl}/profiles`;

    constructor(private http: HttpClient) { }

    getFounderProfile(userId: string): Observable<FounderProfile> {
        return this.http.get<FounderProfile>(`${this.baseUrl}/founder/${userId}`);
    }

    upsertFounderProfile(request: UpsertFounderProfileRequest): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/founder`, request);
    }

    getInvestorProfile(userId: string): Observable<InvestorProfile> {
        return this.http.get<InvestorProfile>(`${this.baseUrl}/investor/${userId}`);
    }

    upsertInvestorProfile(request: UpsertInvestorProfileRequest): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/investor`, request);
    }
}
