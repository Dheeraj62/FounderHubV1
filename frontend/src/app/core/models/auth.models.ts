export interface User {
    id: string;
    email: string;
    role: 'Founder' | 'Investor';
}

export interface AuthResponse {
    token: string;
    userId: string;
    username: string;
    email: string;
    role: 'Founder' | 'Investor';
}

export interface LoginRequest {
    identifier: string;
    password?: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password?: string;
    role: string;
}
