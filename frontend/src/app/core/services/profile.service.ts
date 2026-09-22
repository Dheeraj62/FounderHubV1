import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
    FounderProfile, 
    InvestorProfile, 
    UpsertFounderProfileRequest, 
    UpsertInvestorProfileRequest,
    PublicFounderProfile,
    PublicInvestorProfile,
    UpdateUserProfileRequest,
    ProfileCompletion
} from '../models/profile.models';
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

    getPublicFounderProfile(username: string): Observable<PublicFounderProfile> {
        return this.http.get<PublicFounderProfile>(`${this.baseUrl}/public/founder/${username}`);
    }

    getPublicInvestorProfile(username: string): Observable<PublicInvestorProfile> {
        return this.http.get<PublicInvestorProfile>(`${this.baseUrl}/public/investor/${username}`);
    }

    updateUserProfile(request: UpdateUserProfileRequest): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/user`, request);
    }

    uploadAvatar(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.baseUrl}/avatar`, formData);
    }

    uploadCover(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.baseUrl}/cover`, formData);
    }

    getProfileCompletion(): Observable<ProfileCompletion> {
        return this.http.get<ProfileCompletion>(`${this.baseUrl}/completion`);
    }
}
