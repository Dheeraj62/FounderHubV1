import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Alert {
  id: string;
  userId: string;
  alertType: string;
  title: string;
  message: string;
  relatedIdeaId?: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private http = inject(HttpClient);
  private base = `${API_CONFIG.baseUrl}/alerts`;

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.base);
  }

  markRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/read`, {});
  }

  markAllRead(): Observable<void> {
    return this.http.post<void>(`${this.base}/read-all`, {});
  }
}
