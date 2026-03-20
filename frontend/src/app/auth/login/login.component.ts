import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-[100dvh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-50 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-100/50 blur-3xl opacity-50"></div>
        <div class="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-3xl opacity-50"></div>
      </div>

      <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div class="flex justify-center items-center mb-4">
          <div class="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/20">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="ml-3 text-2xl font-black tracking-tight text-neutral-900">FounderHub</span>
        </div>
        <p class="text-neutral-500 text-sm font-medium">Connect founders with investors. No noise.</p>
      </div>

      <div class="relative z-10 mt-2 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <app-card padding="lg" class="shadow-premium border-0 ring-1 ring-neutral-200/50">
          <h2 class="text-xl font-bold text-neutral-900 mb-6 text-center">Sign in to your account</h2>
          
          <form class="space-y-5" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 p-4 mb-4 rounded-xl flex items-start gap-3">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
            </div>

            <app-input
              id="identifier"
              formControlName="identifier"
              label="Email or Username"
              placeholder="Enter email or username">
            </app-input>

            <app-input
              id="password"
              type="password"
              formControlName="password"
              label="Password"
              placeholder="Enter password">
            </app-input>

            <div class="pt-2">
              <app-button 
                type="submit" 
                variant="primary" 
                [fullWidth]="true" 
                [loading]="isLoading" 
                [disabled]="loginForm.invalid">
                Sign In
              </app-button>
            </div>
          </form>

          <!-- Demo Accounts Section -->
          <div class="mt-8 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
            <p class="text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest text-center">Demo accounts</p>
            <div class="space-y-1.5 break-all">
              <div class="text-[13px] text-neutral-600 flex flex-col sm:flex-row sm:justify-between border-b border-neutral-200 pb-1.5">
                <span class="font-bold text-neutral-800">Founder:</span>
                <span class="font-mono text-xs">sarahchen / founder123</span>
              </div>
              <div class="text-[13px] text-neutral-600 flex flex-col sm:flex-row sm:justify-between pt-1">
                <span class="font-bold text-neutral-800">Investor:</span>
                <span class="font-mono text-xs">investormark / investor123</span>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center bg-neutral-50 -mx-8 -mb-8 px-8 py-4 border-t border-neutral-100 rounded-b-[24px]">
            <p class="text-sm text-neutral-500">
              Don't have an account? 
              <a routerLink="/auth/register" class="font-bold text-primary-600 hover:text-primary-700 transition-colors">Create one</a>
            </p>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class LoginComponent {
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
