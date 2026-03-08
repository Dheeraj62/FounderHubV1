import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Watchlist, AddToWatchlistRequest } from '../models/watchlist.models';

@Injectable({
    providedIn: 'root'
})
export class WatchlistService {
    private apiUrl = `${environment.apiUrl}/Watchlists`;

    constructor(private http: HttpClient) { }

    getMyWatchlist(): Observable<Watchlist[]> {
        return this.http.get<Watchlist[]>(this.apiUrl);
    }

    addToWatchlist(request: AddToWatchlistRequest): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    removeFromWatchlist(ideaId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${ideaId}`);
    }
}
