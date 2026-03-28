import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface WaitlistSubscribeResponse {
  email: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WaitlistService {
  private readonly url = `${API_CONFIG.baseUrl}/waitlist`;

  constructor(private http: HttpClient) {}

  addToWaitlist(email: string): Observable<WaitlistSubscribeResponse> {
    return this.http.post<WaitlistSubscribeResponse>(this.url, { email });
  }
}
