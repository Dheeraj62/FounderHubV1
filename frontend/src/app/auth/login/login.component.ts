import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-[#f8faff] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <!-- Header / Logo Area -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <div class="flex justify-center items-center mb-4">
          <div class="bg-[#1e40af] p-2 rounded-lg shadow-lg">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="ml-3 text-3xl font-bold text-[#1e293b]">FounderHub</span>
        </div>
        <p class="text-[#64748b] text-sm">Connect founders with investors. No noise.</p>
      </div>

      <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div class="bg-white py-10 px-8 shadow-2xl rounded-3xl border border-gray-50">
          <h2 class="text-2xl font-bold text-[#1e293b] mb-8">Sign in to your account</h2>
          
          <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-md">
              <div class="flex">
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="identifier" class="block text-sm font-semibold text-[#475569] mb-1.5">Email or Username</label>
              <div class="mt-1">
                <input id="identifier" type="text" formControlName="identifier" 
                  placeholder="Enter email or username"
                  class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-[#475569] mb-1.5">Password</label>
              <div class="mt-1 relative">
                <input id="password" type="password" formControlName="password" 
                  placeholder="Enter password"
                  class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" [disabled]="loginForm.invalid || isLoading" 
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[#1e40af] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e40af] disabled:opacity-50 transition transform hover:-translate-y-0.5 active:scale-95">
                <span *ngIf="isLoading" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </button>
            </div>
          </form>

          <!-- Demo Accounts Section -->
          <div class="mt-8 bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
            <p class="text-xs font-semibold text-[#64748b] mb-2 uppercase tracking-wider">Demo accounts:</p>
            <div class="space-y-1">
              <p class="text-sm text-[#475569] flex justify-between">
                <span class="font-medium">Founder:</span>
                <span>sarahchen / founder123</span>
              </p>
              <p class="text-sm text-[#475569] flex justify-between">
                <span class="font-medium">Investor:</span>
                <span>investormark / investor123</span>
              </p>
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-sm text-[#64748b]">
              Don't have an account? 
              <a routerLink="/auth/register" class="font-bold text-[#1e40af] hover:underline">Register</a>
            </p>
          </div>
        </div>
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
                this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
                this.cdr.markForCheck();
            }
        });
    }
}
