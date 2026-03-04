import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    private setSession(authResult: AuthResponse) {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('user', JSON.stringify(authResult));
        this.currentUser.set(authResult);
    }

    private loadToken() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser.set(JSON.parse(userStr));
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
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
}
