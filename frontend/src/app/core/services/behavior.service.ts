import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class BehaviorService {
  private http = inject(HttpClient);
  private base = `${API_CONFIG.baseUrl}/behavior`;

  /**
   * Fire-and-forget behavior tracking — we subscribe but ignore the response.
   * Never blocks the user. If this fails, nothing bad happens.
   */
  track(ideaId: string, actionType: 'IdeaClick' | 'TimeSpent' | 'InterestAction' | 'MessageInitiated' | 'WatchlistAdd', durationSeconds?: number) {
    this.http.post(`${this.base}/track`, { ideaId, actionType, durationSeconds }).subscribe({
      error: err => console.warn('[Behavior tracking error — non-critical]', err)
    });
  }
}
