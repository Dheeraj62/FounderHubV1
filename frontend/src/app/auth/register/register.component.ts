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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-black">
      
      <!-- Full-Screen Background -->
      <img src="/assets/images/login-bg-real.png" alt="Collaborative workspace" class="absolute inset-0 w-full h-full object-cover opacity-70 scale-[1.02] hover:scale-100 transition-transform duration-[20s] ease-out z-0" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-[#0a0a0f]/10 z-0"></div>

      <!-- Centered Container -->
      <div class="relative z-10 w-full max-w-[460px] mx-auto px-1">
        
        <!-- Branding Logo -->
        <div class="text-center mb-6 sm:mb-8">
          <a routerLink="/" class="inline-flex flex-col items-center gap-2 sm:gap-3 group">
            <div class="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-105 transition-transform">
              <img src="/assets/images/logo.png" alt="Logo" class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
            </div>
            <span class="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">{{ appName }}</span>
          </a>
          <p class="mt-2 sm:mt-3 text-indigo-100/80 text-xs sm:text-sm font-medium tracking-wide">Join the network of the future builders.</p>
        </div>

        <!-- The Frosted Glass Form Box -->
        <div class="bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 transition-all">
          <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 mb-5 sm:mb-6 text-center tracking-tight">Create your account</h2>
          
          <form class="space-y-4" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-none shadow-none">
              <app-input
                id="username"
                formControlName="username"
                label="Username"
                placeholder="johndoe">
              </app-input>
              <app-input
                id="fullName"
                formControlName="fullName"
                label="Full Name"
                placeholder="John Doe">
              </app-input>
            </div>

            <app-input
              id="email"
              type="email"
              formControlName="email"
              label="Email address"
              placeholder="john@example.com">
            </app-input>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                id="password"
                type="password"
                formControlName="password"
                label="Password"
                placeholder="Min. 6 characters">
              </app-input>
              <div>
                <label for="role" class="block text-sm font-bold text-neutral-900 mb-1.5">I am a...</label>
                <div class="relative">
                  <select id="role" formControlName="role" 
                    class="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 appearance-none h-[42px] font-medium shadow-sm">
                    <option value="Founder">Founder</option>
                    <option value="Investor">Investor</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full mt-6 flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.25)] text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Creating account...' : 'Start Your Journey' }}
            </button>
          </form>
        </div>
        
        <p class="mt-8 text-center text-sm text-neutral-300 font-medium">
          Already have an account?
          <a routerLink="/auth/login" class="font-bold text-white hover:text-indigo-300 transition-colors ml-1 uppercase text-xs tracking-wider border-b border-white/30 pb-0.5 hover:border-indigo-300">
            Sign in
          </a>
        </p>
      </div>

    </div>
  `
})
export class RegisterComponent {
  appName = AppConstants.APP_NAME;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Founder', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        let errorMsg = err.error?.message || 'Registration failed.';
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
