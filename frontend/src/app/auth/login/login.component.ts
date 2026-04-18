import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { AppConstants } from '../../core/constants/app.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-black">
      
      <!-- Full-Screen Background -->
      <img src="/assets/images/login-bg-real.png" alt="Collaborative workspace" class="absolute inset-0 w-full h-full object-cover opacity-70 scale-[1.02] hover:scale-100 transition-transform duration-[20s] ease-out z-0" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-[#0a0a0f]/10 z-0"></div>

      <!-- Centered Container -->
      <div class="relative z-10 w-full max-w-[420px] mx-auto">
        
        <!-- Branding Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex flex-col items-center gap-3 group">
            <div class="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-105 transition-transform">
              <img src="/assets/images/logo.png" alt="Logo" class="h-12 w-12 rounded-xl" />
            </div>
            <span class="text-3xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">{{ appName }}</span>
          </a>
          <p class="mt-3 text-indigo-100/80 text-sm font-medium tracking-wide">Connect founders with investors. No noise.</p>
        </div>

        <!-- The Frosted Glass Form Box -->
        <div class="bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/40 rounded-3xl p-8 sm:p-10 transition-all">
          <h2 class="text-2xl font-extrabold text-neutral-900 mb-6 text-center tracking-tight">Welcome back</h2>
          
          <form class="space-y-4" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
            </div>

            <app-input
              id="identifier"
              label="Email address"
              type="email"
              formControlName="identifier"
              placeholder="you@company.com"
              [error]="(loginForm.get('identifier')?.touched && loginForm.get('identifier')?.hasError('required')) ? 'Email is required' : (loginForm.get('identifier')?.touched && loginForm.get('identifier')?.hasError('email')) ? 'Invalid email format' : ''"
            ></app-input>

            <div>
              <app-input
                id="password"
                label="Password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                [error]="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required') ? 'Password is required' : ''"
              ></app-input>
              <div class="flex items-center justify-end mt-1.5">
                <a href="#" class="text-xs font-bold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full mt-6 flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.25)] text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Signing in...' : 'Sign in to platform' }}
            </button>
          </form>
        </div>
        
        <p class="mt-8 text-center text-sm text-neutral-300 font-medium">
          Don't have an account?
          <a routerLink="/auth/register" class="font-bold text-white hover:text-indigo-300 transition-colors ml-1 uppercase text-xs tracking-wider border-b border-white/30 pb-0.5 hover:border-indigo-300">
            Join as a founder
          </a>
        </p>
      </div>

    </div>
  `
})
export class LoginComponent {
  appName = AppConstants.APP_NAME;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        if (res.role === 'Founder') {
          this.router.navigate(['/founder/dashboard']);
        } else {
          this.router.navigate(['/investor/browse']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        let errorMsg = err.error?.message || 'Login failed. Please check your credentials.';
        if (err.status === 400 && err.error?.errors) {
            errorMsg = Object.values<{[_: string]: string[]}>(err.error.errors).flat().join(' ');
        } else if (err.status === 400 && typeof err.error === 'string') {
            errorMsg = err.error;
        }
        this.errorMessage = errorMsg;
        this.cdr.markForCheck();
      }
    });
  }
}
