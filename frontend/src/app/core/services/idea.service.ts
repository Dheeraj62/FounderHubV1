import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idea, CreateIdeaRequest, PaginatedIdeas, RecommendedIdea } from '../models/idea.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class IdeaService {
    private baseUrl = `${API_CONFIG.baseUrl}/ideas`;

    constructor(private http: HttpClient) { }

    // Founder
    createIdea(request: CreateIdeaRequest): Observable<Idea> {
        return this.http.post<Idea>(this.baseUrl, request);
    }

    getMyIdeas(): Observable<Idea[]> {
        return this.http.get<Idea[]>(`${this.baseUrl}/my`);
    }

    updateIdea(id: string, request: CreateIdeaRequest): Observable<Idea> {
        return this.http.put<Idea>(`${this.baseUrl}/${id}`, request);
    }

    deleteIdea(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    // Investor
    getIdeas(stage?: string, industry?: string, previouslyRejected?: boolean, location?: string, keyword?: string, page: number = 1, pageSize: number = 10): Observable<PaginatedIdeas> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (stage) params = params.set('stage', stage);
        if (industry) params = params.set('industry', industry);
        if (previouslyRejected !== undefined) params = params.set('previouslyRejected', previouslyRejected);
        if (location) params = params.set('location', location);
        if (keyword) params = params.set('keyword', keyword);

        return this.http.get<PaginatedIdeas>(this.baseUrl, { params });
    }

    getIdeaById(id: string): Observable<Idea> {
        return this.http.get<Idea>(`${this.baseUrl}/${id}`);
    }

    getRecommended(): Observable<RecommendedIdea[]> {
        return this.http.get<RecommendedIdea[]>(`${this.baseUrl}/recommended`);
    }

    getSmartMatches(page: number = 1, pageSize: number = 20): Observable<RecommendedIdea[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        return this.http.get<RecommendedIdea[]>(`${API_CONFIG.baseUrl}/smart-matches`, { params });
    }
}
