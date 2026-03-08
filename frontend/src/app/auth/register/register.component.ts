import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-[100dvh] bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl opacity-50"></div>
        <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary-100/50 blur-3xl opacity-50"></div>
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
        <p class="text-neutral-500 text-sm font-medium">Join the network of the future builders.</p>
      </div>

      <div class="relative z-10 mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <app-card padding="lg" class="shadow-premium border-0 ring-1 ring-neutral-200/50">
          <h2 class="text-xl font-bold text-neutral-900 mb-6 text-center">Create your account</h2>
          
          <form class="space-y-5" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <app-input
                id="password"
                type="password"
                formControlName="password"
                label="Password"
                placeholder="Min. 6 characters">
              </app-input>
              <div>
                <label for="role" class="block text-sm font-bold text-neutral-900 mb-1.5">I am a...</label>
                <select id="role" formControlName="role" 
                  class="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 leading-none h-[42px]">
                  <option value="Founder">Founder</option>
                  <option value="Investor">Investor</option>
                </select>
              </div>
            </div>

            <div class="pt-4">
              <app-button 
                type="submit" 
                variant="primary" 
                [fullWidth]="true" 
                [loading]="isLoading" 
                [disabled]="registerForm.invalid">
                Start Your Journey
              </app-button>
            </div>
          </form>

          <div class="mt-8 text-center bg-neutral-50 -mx-8 -mb-8 px-8 py-4 border-t border-neutral-100 rounded-b-[24px]">
            <p class="text-sm text-neutral-500">
              Already have an account? 
              <a routerLink="/auth/login" class="font-bold text-primary-600 hover:text-primary-700 transition-colors">Sign in</a>
            </p>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class RegisterComponent {
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
        this.errorMessage = err.error?.message || 'Registration failed.';
        this.cdr.markForCheck();
      }
    });
  }
}
