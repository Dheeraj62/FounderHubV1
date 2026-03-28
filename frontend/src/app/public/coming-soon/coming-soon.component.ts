import { Component, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError, finalize, timeout } from 'rxjs';
import { WaitlistService } from '../../core/services/waitlist.service';

/** Response body shape (camelCase or PascalCase from JSON). */
interface WaitlistSuccessBody {
  email?: string;
  Email?: string;
}

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <!-- Animated Background Elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" style="animation-delay: 2s;"></div>

      <!-- Content Container -->
      <div class="z-10 w-full max-w-2xl text-center space-y-8 animate-fade-in">
        <!-- Logo/Header -->
        <div class="space-y-2">
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
            PitchConnect
          </h1>
          <p class="text-blue-200/60 uppercase tracking-[0.3em] text-sm font-medium">Coming Soon!</p>
        </div>

        <!-- Glassmorphism Card -->
        <div class="backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
          <div *ngIf="!isSubscribed()" class="animate-fade-in">
            <h2 class="text-2xl md:text-3xl font-semibold">Elevating the startup ecosystem.</h2>
            <p class="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
              We're building the ultimate platform for founders and investors to connect, collaborate, and scale. Something big is brewing.
            </p>

            <!-- Subscription Form -->
            <form (ngSubmit)="onNotifyMe()" #notifyForm="ngForm" class="flex flex-col sm:flex-row gap-3 mt-8">
              <input 
                type="email" 
                name="email"
                [(ngModel)]="email"
                (ngModelChange)="errorMessage = ''"
                [readOnly]="isLoading()"
                required
                email
                placeholder="Enter your email address" 
                class="flex-grow bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-500 read-only:opacity-60 read-only:cursor-not-allowed"
              />
              <button 
                type="submit"
                [disabled]="isLoading() || !notifyForm.valid"
                class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading()">Notify Me</span>
                <span *ngIf="isLoading()" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              </button>
            </form>
            
            <p *ngIf="errorMessage" class="text-sm text-amber-400/90 mt-4">{{ errorMessage }}</p>
            <p class="text-xs text-slate-500 mt-4">Be first in line when we go live.</p>
          </div>

          <!-- Success Message -->
          <div *ngIf="isSubscribed()" class="animate-fade-in py-8 space-y-4">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white">You're on the list!</h3>
            <p class="text-slate-400 max-w-sm mx-auto">
              Thanks for your interest. We'll send an invite to <span class="text-blue-400 font-medium">{{confirmedEmail}}</span> as soon as we're ready.
            </p>
            <button 
              (click)="resetForm()"
              class="text-slate-500 text-sm hover:text-white transition-colors underline underline-offset-4"
            >
              Enter another email
            </button>
          </div>
        </div>


        <!-- Progress Indicator (Just visual) -->
        <div class="flex items-center justify-center gap-4 text-slate-500">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-slate-950 bg-blue-500"></div>
            <div class="w-8 h-8 rounded-full border-2 border-slate-950 bg-cyan-500"></div>
            <div class="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-700"></div>
          </div>
          <span class="text-sm">Join 200+ waiting founders</span>
        </div>
      </div>

      <!-- Footer -->
      <footer class="absolute bottom-8 text-slate-600 text-sm">
        &copy; 2026 FounderHub. All rights reserved.
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 1s ease-out forwards;
    }
  `]
})
export class ComingSoonComponent {
  private readonly waitlistService = inject(WaitlistService);
  private readonly ngZone = inject(NgZone);

  email: string = '';
  /** Email persisted on the server, shown on success (API-normalized). */
  confirmedEmail: string = '';
  readonly isSubscribed = signal(false);
  readonly isLoading = signal(false);
  errorMessage: string = '';

  onNotifyMe() {
    const emailToSend = this.email.trim();
    if (!emailToSend) return;

    this.isLoading.set(true);
    this.errorMessage = '';

    this.waitlistService
      .addToWaitlist(emailToSend)
      .pipe(
        timeout(25_000),
        finalize(() => {
          this.ngZone.run(() => this.isLoading.set(false));
        })
      )
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            const body = res as WaitlistSuccessBody | null | undefined;
            this.confirmedEmail =
              body?.email ?? body?.Email ?? emailToSend;
            this.isSubscribed.set(true);
          });
        },
        error: (err: unknown) => {
          this.ngZone.run(() => {
            if (err instanceof TimeoutError) {
              this.errorMessage =
                'Request timed out. Check that the API is running and try again.';
              return;
            }
            const httpErr = err as HttpErrorResponse;
            if (httpErr.status === 409) {
              const b = httpErr.error as { message?: string } | null;
              this.errorMessage = b?.message ?? 'This email is already on the list.';
              return;
            }
            if (httpErr.status === 400) {
              const b = httpErr.error as { errors?: Record<string, string[]>; title?: string } | null;
              const first =
                b?.errors && Object.keys(b.errors).length > 0
                  ? Object.values(b.errors)[0]?.[0]
                  : undefined;
              this.errorMessage =
                first ?? (b as { title?: string })?.title ?? 'Please enter a valid email address.';
              return;
            }
            if (httpErr.status === 0) {
              this.errorMessage =
                'Cannot reach the server. If you use ng serve, ensure the backend is running (e.g. on port 5111).';
              return;
            }
            this.errorMessage = 'Something went wrong. Please try again in a moment.';
          });
        }
      });
  }

  resetForm() {
    this.isSubscribed.set(false);
    this.email = '';
    this.confirmedEmail = '';
    this.errorMessage = '';
  }
}

