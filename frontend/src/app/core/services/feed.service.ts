import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { FeedItem } from '../models/feed.models';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private baseUrl = `${API_CONFIG.baseUrl}/feed`;

  constructor(private http: HttpClient) {}

  getGlobal(page: number = 1, pageSize: number = 20): Observable<FeedItem[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<FeedItem[]>(this.baseUrl, { params });
  }

  getFollowing(page: number = 1, pageSize: number = 20): Observable<FeedItem[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<FeedItem[]>(`${this.baseUrl}/following`, { params });
  }

  getTrending(limit: number = 10): Observable<FeedItem[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<FeedItem[]>(`${this.baseUrl}/trending`, { params });
  }
}

