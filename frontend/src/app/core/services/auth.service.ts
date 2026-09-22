import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = `${API_CONFIG.baseUrl}/auth`;

    currentUser = signal<AuthResponse | null>(null);

    constructor(private http: HttpClient) {
        this.loadToken();
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
            tap(res => this.setSession(res))
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
            tap(res => this.setSession(res))
        );
    }

    refreshAccessToken(): Observable<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token'));
        }
        return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
            tap(res => this.setSession(res))
        );
    }

    refreshToken(): Observable<AuthResponse> {
        return this.refreshAccessToken();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    private setSession(authResult: AuthResponse) {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('refreshToken', authResult.refreshToken);
        localStorage.setItem('user', JSON.stringify(authResult));
        this.currentUser.set(authResult);
    }

    private loadToken() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const parsed = JSON.parse(userStr);
            // Invalidate stale sessions that don't have the username field
            if (!parsed.username) {
                this.logout();
                return;
            }
            this.currentUser.set(parsed);
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    getUserId(): string | null {
        return this.currentUser()?.userId || null;
    }

    getUserRole(): string | null {
        return this.currentUser()?.role || null;
    }

    getRole(): string | null {
        return this.getUserRole();
    }

    getUsername(): string | null {
        return this.currentUser()?.username || null;
    }
}
