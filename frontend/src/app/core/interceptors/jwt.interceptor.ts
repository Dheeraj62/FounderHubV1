import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, filter, take, throwError, BehaviorSubject, Observable } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    let authReq = req;
    if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register') && !req.url.includes('/auth/refresh')) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/auth/')) {
                return handle401Error(authReq, next, authService, router);
            }
            return throwError(() => error);
        })
    );
};

export const jwtInterceptor = authInterceptor;

function handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
    router: Router
): Observable<HttpEvent<unknown>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshAccessToken().pipe(
            switchMap((response) => {
                isRefreshing = false;
                refreshTokenSubject.next(response.token);
                return next(req.clone({
                    setHeaders: { Authorization: `Bearer ${response.token}` }
                }));
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                router.navigate(['/auth/login']);
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter((token): token is string => token !== null),
            take(1),
            switchMap((token) => {
                return next(req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                }));
            })
        );
    }
}

