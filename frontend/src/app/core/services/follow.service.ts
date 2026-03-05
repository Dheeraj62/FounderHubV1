import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Follow, FollowRequest, FollowType } from '../models/follow.models';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private baseUrl = `${API_CONFIG.baseUrl}`;

  constructor(private http: HttpClient) {}

  follow(req: FollowRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/follow`, req);
  }

  unfollow(req: FollowRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/follow`, { body: req });
  }

  getFollowing(type?: FollowType): Observable<Follow[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<Follow[]>(`${this.baseUrl}/following`, { params });
  }

  getFollowers(type?: FollowType): Observable<Follow[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<Follow[]>(`${this.baseUrl}/followers`, { params });
  }
}

