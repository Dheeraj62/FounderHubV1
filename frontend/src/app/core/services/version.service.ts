import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdeaVersion, CreateVersionRequest } from '../models/version.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    private baseUrl = `${API_CONFIG.baseUrl}/ideas`;

    constructor(private http: HttpClient) { }

    getVersions(ideaId: string): Observable<IdeaVersion[]> {
        return this.http.get<IdeaVersion[]>(`${this.baseUrl}/${ideaId}/versions`);
    }

    createVersion(ideaId: string, request: CreateVersionRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${ideaId}/versions`, request);
    }
}
