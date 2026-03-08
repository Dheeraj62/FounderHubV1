import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CredibilityScore {
    score: number;
    maxScore: number;
    badge: string;
    profileScore: number;
    ideaScore: number;
    engagementScore: number;
    totalIdeas: number;
    totalViews: number;
}

@Injectable({
    providedIn: 'root'
})
export class CredibilityService {
    private apiUrl = `${environment.apiUrl}/Credibility`;

    constructor(private http: HttpClient) { }

    getScore(founderId: string): Observable<CredibilityScore> {
        return this.http.get<CredibilityScore>(`${this.apiUrl}/${founderId}`);
    }

    getMyScore(): Observable<CredibilityScore> {
        return this.http.get<CredibilityScore>(`${this.apiUrl}/my`);
    }
}
