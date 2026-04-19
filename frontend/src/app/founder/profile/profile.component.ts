import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertFounderProfileRequest } from '../../core/models/profile.models';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { LinkedInService } from '../../core/services/linkedin.service';

@Component({
  selector: 'app-founder-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
      <div class="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
        
        <!-- Header -->
        <div class="bg-primary-50 border-b border-primary-100 p-5 sm:p-8 text-center sm:text-left">
          <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900">Founder Profile</h1>
          <p class="text-primary-700 mt-1 sm:mt-2 text-sm sm:text-base">Build your credibility to attract the best investors.</p>
        </div>

        <form #profileForm="ngForm" (ngSubmit)="save(profileForm)" class="p-5 sm:p-8 space-y-6 sm:space-y-8">
          
          <!-- LinkedIn Verification Card -->
          <div class="p-4 sm:p-5 bg-primary-50/50 border border-primary-100 rounded-xl space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-start sm:items-center gap-3">
                <div class="w-10 h-10 shrink-0 rounded-xl bg-[#0A66C2] flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div>
                  <h3 class="font-bold text-primary-900 text-sm sm:text-base">LinkedIn Verification</h3>
                  <p class="text-xs text-primary-600">Authenticate with LinkedIn OAuth 2.0 to verify your identity.</p>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-2">
                <ng-container *ngIf="model.linkedInVerified">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    Verified
                  </span>
                  <button type="button" (click)="unlinkLinkedIn()"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 transition-all">
                    Unlink
                  </button>
                </ng-container>
                <button *ngIf="!model.linkedInVerified" type="button" (click)="startLinkedInOAuth()"
                        [disabled]="linkedInVerifying"
                        class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#0A66C2] text-white hover:bg-[#004182] disabled:opacity-50 transition-all shadow-sm flex items-center gap-2">
                  <svg *ngIf="!linkedInVerifying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <svg *ngIf="linkedInVerifying" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  {{ linkedInVerifying ? 'Connecting...' : 'Sign in with LinkedIn' }}
                </button>
              </div>
            </div>

            <!-- LinkedIn error message -->
            <p *ngIf="linkedInError" class="text-xs text-rose-600 font-medium border-t border-primary-100 pt-2">{{ linkedInError }}</p>

            <!-- Show verified LinkedIn profile URL -->
            <div *ngIf="model.linkedInVerified && model.linkedInProfileUrl" class="pt-2 border-t border-primary-100">
              <a [href]="model.linkedInProfileUrl" target="_blank" rel="noopener noreferrer" class="text-xs sm:text-sm text-[#0A66C2] font-medium hover:underline flex items-center gap-1.5 break-all">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                {{ model.linkedInProfileUrl }}
              </a>
            </div>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Expertise -->
            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-primary-600 border-b border-neutral-200 pb-2">Expertise & Experience</h3>
              
              <div class="flex items-center justify-between">
                <label class="text-neutral-700 font-medium text-sm">Technical Founder?</label>
                <input type="checkbox" [(ngModel)]="model.technicalFounder" name="tech" 
                       class="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Previous Startups Built</label>
                <input type="number" [(ngModel)]="model.previousStartupCount" name="startups" min="0"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 sm:p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Years of Domain Experience</label>
                <input type="number" [(ngModel)]="model.domainExperienceYears" name="xp" min="0"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 sm:p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm">
              </div>
            </div>

            <!-- Team & Bio -->
            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-primary-600 border-b border-neutral-200 pb-2">Venture Details</h3>
              
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Core Team Size</label>
                <input type="number" [(ngModel)]="model.teamSize" name="team" min="1"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 sm:p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Primary Location <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.location" name="loc" placeholder="City, Country" required
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 sm:p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Founder Bio (Pitch yourself) <span class="text-red-500">*</span></label>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4" required placeholder="Tell investors about yourself..."
                      class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 sm:p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-sm"></textarea>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-end pt-2 sm:pt-4 gap-3">
            <button type="submit" [disabled]="profileForm.invalid || saving"
                    class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 sm:px-10 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-500/30 text-sm sm:text-base w-full sm:w-auto">
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class FounderProfileComponent implements OnInit {
  private toastService = inject(ToastService);
  private linkedInService = inject(LinkedInService);
  
  model: UpsertFounderProfileRequest = {
    technicalFounder: false,
    previousStartupCount: 0,
    domainExperienceYears: 0,
    teamSize: 1,
    linkedInVerified: false,
    bio: '',
    location: ''
  };

  linkedInVerifying = false;
  linkedInError = '';
  saving = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getFounderProfile(userId).subscribe({
        next: (p) => {
          this.model = {
            technicalFounder: p.technicalFounder,
            previousStartupCount: p.previousStartupCount,
            domainExperienceYears: p.domainExperienceYears,
            teamSize: p.teamSize,
            linkedInVerified: p.linkedInVerified,
            linkedInProfileUrl: p.linkedInProfileUrl,
            bio: p.bio,
            location: p.location
          };
          this.cdr.markForCheck();
        },
        error: () => { } // Profile likely doesn't exist yet
      });
    }
  }

  /**
   * Initiates the LinkedIn OAuth 2.0 flow by redirecting
   * the user to the LinkedIn authorization page.
   */
  startLinkedInOAuth(): void {
    this.linkedInError = '';
    this.linkedInVerifying = true;

    this.linkedInService.getAuthUrl().subscribe({
      next: (res) => {
        // Store OAuth state in sessionStorage for CSRF validation
        sessionStorage.setItem('linkedin_oauth_state', res.state);
        // Redirect the user to LinkedIn's OAuth authorization page
        window.location.href = res.authUrl;
      },
      error: (err) => {
        this.linkedInVerifying = false;
        this.linkedInError = err.error?.message || 'LinkedIn integration is not configured. Ask the admin to set up LinkedIn API credentials.';
        this.cdr.markForCheck();
      }
    });
  }

  unlinkLinkedIn(): void {
    this.model.linkedInVerified = false;
    this.model.linkedInProfileUrl = undefined;
    this.linkedInError = '';
    this.toastService.success('LinkedIn unlinked. Click "Sign in with LinkedIn" to re-verify.');
    this.cdr.markForCheck();
  }

  save(form: any): void {
    if (form.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.');
      return;
    }

    this.saving = true;

    // Safely parse numbers to avoid .NET Int32 JSON binding errors on empty strings
    this.model.previousStartupCount = Number(this.model.previousStartupCount) || 0;
    this.model.domainExperienceYears = Number(this.model.domainExperienceYears) || 0;
    this.model.teamSize = Number(this.model.teamSize) || 1;

    this.profileService.upsertFounderProfile(this.model).subscribe({
      next: () => {
        this.saving = false;
        this.toastService.success('Profile updated successfully!');
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.saving = false;
        console.error('Error saving founder profile:', err);
        let errorMsg = 'Failed to save profile. Status: ' + (err.status || 'Unknown');
        if (err.status === 400 && err.error?.errors) {
            errorMsg = Object.values<{[_: string]: string[]}>(err.error.errors).flat().join(' ');
        } else if (err.status === 400 && typeof err.error === 'string') {
            errorMsg = err.error;
        }
        this.toastService.error(errorMsg);
        this.cdr.markForCheck();
      }
    });
  }
}

