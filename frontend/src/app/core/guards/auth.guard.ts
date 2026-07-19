import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (token && !isTokenExpired(token)) {
        return true;
    }

    // Token missing or expired — clear stale session and redirect
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
};

/**
 * Decode a JWT and check if it has expired.
 * Returns true if the token is expired or malformed.
 */
function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false; // No expiry claim — treat as valid
        const expiryMs = payload.exp * 1000;
        // Add 30-second buffer to avoid edge-case race conditions
        return Date.now() >= (expiryMs - 30_000);
    } catch {
        // Malformed token — treat as expired
        return true;
    }
}
