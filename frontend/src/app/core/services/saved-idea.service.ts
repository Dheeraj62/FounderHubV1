import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idea } from '../models/idea.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class SavedIdeaService {
    private baseUrl = `${API_CONFIG.baseUrl}/saved-ideas`;

    constructor(private http: HttpClient) { }

    getSavedIdeas(): Observable<Idea[]> {
        return this.http.get<Idea[]>(this.baseUrl);
    }

    saveIdea(ideaId: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${ideaId}`, {});
    }

    unsaveIdea(ideaId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${ideaId}`);
    }
}
