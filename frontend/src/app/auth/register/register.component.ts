import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#f8faff] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <div class="flex justify-center items-center mb-4">
          <div class="bg-[#1e40af] p-2 rounded-lg shadow-lg">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="ml-3 text-3xl font-bold text-[#1e293b]">FounderHub</span>
        </div>
        <p class="text-[#64748b] text-sm">Join the network of the future builders.</p>
      </div>

      <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white py-10 px-8 shadow-2xl rounded-3xl border border-gray-50">
          <h2 class="text-2xl font-bold text-[#1e293b] mb-8 text-center">Create your account</h2>
          
          <form class="space-y-5" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-md text-sm text-red-700">
              {{ errorMessage }}
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="username" class="block text-sm font-semibold text-[#475569] mb-1.5">Username</label>
                <input id="username" type="text" formControlName="username" 
                  class="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
              </div>
              <div>
                <label for="fullName" class="block text-sm font-semibold text-[#475569] mb-1.5">Full Name</label>
                <input id="fullName" type="text" formControlName="fullName" 
                  class="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-[#475569] mb-1.5">Email address</label>
              <input id="email" type="email" formControlName="email" 
                class="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="password" class="block text-sm font-semibold text-[#475569] mb-1.5">Password</label>
                <input id="password" type="password" formControlName="password" 
                  class="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
              </div>
              <div>
                <label for="role" class="block text-sm font-semibold text-[#475569] mb-1.5">I am a...</label>
                <select id="role" formControlName="role" 
                  class="block w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all sm:text-sm">
                  <option value="Founder">Founder</option>
                  <option value="Investor">Investor</option>
                </select>
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" [disabled]="registerForm.invalid || isLoading" 
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[#1e40af] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e40af] disabled:opacity-50 transition transform hover:-translate-y-0.5 active:scale-95">
                <span *ngIf="isLoading" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Start Your Journey
              </button>
            </div>
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm text-[#64748b]">
              Already have an account? 
              <a routerLink="/auth/login" class="font-bold text-[#1e40af] hover:underline">Sign in</a>
            </p>
          </div>
        </div>
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
