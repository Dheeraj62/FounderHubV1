import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface FounderUpdate {
  id: string;
  founderId: string;
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FounderUpdatesService {
  private baseUrl = `${API_CONFIG.baseUrl}/updates`;

  constructor(private http: HttpClient) {}

  create(content: string): Observable<FounderUpdate> {
    return this.http.post<FounderUpdate>(this.baseUrl, { content });
  }

  getByFounder(founderId: string, page: number = 1, pageSize: number = 20): Observable<FounderUpdate[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<FounderUpdate[]>(`${this.baseUrl}/${founderId}`, { params });
  }
}

