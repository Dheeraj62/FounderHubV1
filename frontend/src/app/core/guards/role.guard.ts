import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedRole = route.data?.['role'];
    const userRole = authService.getRole();

    if (authService.getToken() && expectedRole === userRole) {
        return true;
    }

    // Fallback routing if wrong role
    if (userRole === 'Founder') {
        router.navigate(['/founder/dashboard']);
    } else if (userRole === 'Investor') {
        router.navigate(['/investor/browse']);
    } else {
        router.navigate(['/auth/login']);
    }

    return false;
};
