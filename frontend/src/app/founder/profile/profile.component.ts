import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertFounderProfileRequest, UpdateUserProfileRequest, ProfileCompletion } from '../../core/models/profile.models';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-founder-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-4 space-y-6">
      
      <!-- Profile Completion Banner -->
      <div *ngIf="completion" class="bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h2 class="text-xl font-bold">Profile Completion</h2>
              <span class="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">{{ completion.percent }}%</span>
            </div>
            <p class="text-primary-100 text-sm">A complete profile gets 4x more investor responses.</p>
          </div>
          <a *ngIf="username" [routerLink]="['/founders', username]" class="px-5 py-2.5 rounded-xl bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm transition-all shadow-md shrink-0">
            View Public Profile ↗
          </a>
        </div>
        <!-- Progress Bar -->
        <div class="w-full bg-white/20 rounded-full h-2.5 mt-4 overflow-hidden">
          <div class="bg-white h-2.5 rounded-full transition-all duration-500" [style.width.%]="completion.percent"></div>
        </div>
        <div *ngIf="completion.missingFields.length > 0" class="mt-3 text-xs text-primary-200 flex flex-wrap gap-2 items-center">
          <span class="font-bold">Suggested additions:</span>
          <span *ngFor="let field of completion.missingFields.slice(0, 4)" class="px-2 py-0.5 rounded bg-white/10">{{ field }}</span>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
        
        <!-- Header -->
        <div class="bg-primary-50 border-b border-primary-100 p-5 sm:p-8 text-center sm:text-left">
          <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900">Founder Profile</h1>
          <p class="text-primary-700 mt-1 text-sm sm:text-base">Build your credibility to attract top investors and co-founders.</p>
        </div>

        <form #profileForm="ngForm" (ngSubmit)="save(profileForm)" class="p-5 sm:p-8 space-y-8">
          
          <!-- Identity Section (Full Name & Headline) -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Identity & Headline</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="userModel.fullName" name="fullName" placeholder="e.g. Sarah Chen"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Headline</label>
                <input type="text" [(ngModel)]="userModel.headline" name="headline" placeholder="e.g. Building AI for Logistics | 2x Founder"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm">
              </div>
            </div>
          </div>

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
                    ✓ Verified
                  </span>
                  <button type="button" (click)="unlinkLinkedIn()"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 transition-all">
                    Unlink
                  </button>
                </ng-container>
                <button *ngIf="!model.linkedInVerified" type="button" (click)="startLinkedInOAuth()"
                        [disabled]="linkedInVerifying"
                        class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#0A66C2] text-white hover:bg-[#004182] disabled:opacity-50 transition-all shadow-sm flex items-center gap-2">
                  {{ linkedInVerifying ? 'Connecting...' : 'Sign in with LinkedIn' }}
                </button>
              </div>
            </div>

            <p *ngIf="linkedInError" class="text-xs text-rose-600 font-medium border-t border-primary-100 pt-2">{{ linkedInError }}</p>

            <div *ngIf="model.linkedInVerified && model.linkedInProfileUrl" class="pt-2 border-t border-primary-100">
              <a [href]="model.linkedInProfileUrl" target="_blank" rel="noopener noreferrer" class="text-xs sm:text-sm text-[#0A66C2] font-medium hover:underline flex items-center gap-1.5 break-all">
                {{ model.linkedInProfileUrl }}
              </a>
            </div>
          </div>

          <!-- Current Venture Context -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Venture Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Current Startup Name</label>
                <input type="text" [(ngModel)]="model.currentStartup" name="currentStartup" placeholder="e.g. Acme Corp"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Startup Stage</label>
                <select [(ngModel)]="model.startupStage" name="startupStage"
                        class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea Phase</option>
                  <option value="MVP">MVP Built</option>
                  <option value="Early Traction">Early Traction / Revenue</option>
                  <option value="Growth">Growth / Scaling</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Expertise Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Background & Experience</h3>
              
              <div class="flex items-center justify-between">
                <label class="text-neutral-700 font-medium text-sm">Technical Founder?</label>
                <input type="checkbox" [(ngModel)]="model.technicalFounder" name="tech" 
                       class="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Previous Startups Built</label>
                <input type="number" [(ngModel)]="model.previousStartupCount" name="startups" min="0"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Years of Domain Experience</label>
                <input type="number" [(ngModel)]="model.domainExperienceYears" name="xp" min="0"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Team & Location</h3>
              
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Core Team Size</label>
                <input type="number" [(ngModel)]="model.teamSize" name="team" min="1"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Primary Location <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.location" name="loc" placeholder="City, Country" required
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 text-sm">
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Founder Bio (Pitch yourself) <span class="text-red-500">*</span></label>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4" required placeholder="Tell investors about yourself, your domain expertise, and why you are building this..."
                      class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-2 focus:ring-primary-500 resize-none text-sm"></textarea>
          </div>

          <!-- Skills Tag Input -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Skills & Core Strengths</label>
            <div class="flex gap-2 mb-2">
              <input type="text" [(ngModel)]="skillInput" name="skillInput" placeholder="Add skill (e.g. AI/ML, Full-Stack, Growth, Sales)" (keyup.enter)="addSkill()"
                     class="flex-1 bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              <button type="button" (click)="addSkill()" class="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 font-bold rounded-lg text-sm text-neutral-700">Add</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of model.skills; let i = index" class="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                {{ skill }}
                <button type="button" (click)="removeSkill(i)" class="hover:text-rose-600">×</button>
              </span>
            </div>
          </div>

          <!-- Looking For (Multi-select) -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Currently Looking For</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label *ngFor="let item of lookingForOptions" class="flex items-center gap-2 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer text-xs font-bold text-neutral-700">
                <input type="checkbox" [checked]="model.lookingFor.includes(item)" (change)="toggleLookingFor(item)" class="rounded text-primary-600 focus:ring-primary-500">
                {{ item }}
              </label>
            </div>
          </div>

          <!-- Social Links -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Social & External Links</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Startup Website</label>
                <input type="url" [(ngModel)]="model.startupWebsite" name="startupWebsite" placeholder="https://mycompany.com"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Personal Website</label>
                <input type="url" [(ngModel)]="model.website" name="website" placeholder="https://alexsmith.com"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">GitHub URL</label>
                <input type="url" [(ngModel)]="model.gitHubUrl" name="gitHubUrl" placeholder="https://github.com/username"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">X (Twitter) URL</label>
                <input type="url" [(ngModel)]="model.twitterUrl" name="twitterUrl" placeholder="https://x.com/username"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-end pt-4 gap-3">
            <button type="submit" [disabled]="profileForm.invalid || saving"
                    class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md text-sm sm:text-base w-full sm:w-auto">
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FounderProfileComponent implements OnInit {
  private toastService = inject(ToastService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  userModel: UpdateUserProfileRequest = {
    fullName: '',
    headline: ''
  };

  model: UpsertFounderProfileRequest = {
    technicalFounder: false,
    previousStartupCount: 0,
    domainExperienceYears: 0,
    teamSize: 1,
    linkedInVerified: false,
    bio: '',
    location: '',
    currentStartup: '',
    startupStage: '',
    skills: [],
    industries: [],
    lookingFor: []
  };

  lookingForOptions = ['Investors', 'Co-founder', 'Mentor', 'Employees'];
  skillInput = '';
  linkedInVerifying = false;
  linkedInError = '';
  saving = false;
  username = this.authService.getUsername();
  completion: ProfileCompletion | null = null;

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
            location: p.location,
            gitHubUrl: p.gitHubUrl,
            twitterUrl: p.twitterUrl,
            website: p.website,
            startupWebsite: p.startupWebsite,
            currentStartup: p.currentStartup || '',
            startupStage: p.startupStage || '',
            skills: p.skills || [],
            industries: p.industries || [],
            lookingFor: p.lookingFor || []
          };
          this.cdr.markForCheck();
        },
        error: () => {}
      });

      this.loadCompletion();
    }
  }

  loadCompletion(): void {
    this.profileService.getProfileCompletion().subscribe({
      next: (res) => {
        this.completion = res;
        this.cdr.markForCheck();
      }
    });
  }

  addSkill(): void {
    const s = this.skillInput.trim();
    if (s && !this.model.skills.includes(s)) {
      this.model.skills.push(s);
      this.skillInput = '';
    }
  }

  removeSkill(index: number): void {
    this.model.skills.splice(index, 1);
  }

  toggleLookingFor(item: string): void {
    const idx = this.model.lookingFor.indexOf(item);
    if (idx >= 0) {
      this.model.lookingFor.splice(idx, 1);
    } else {
      this.model.lookingFor.push(item);
    }
  }

  startLinkedInOAuth(): void {
    this.linkedInVerifying = true;
    setTimeout(() => {
        this.linkedInVerifying = false;
        this.linkedInError = 'LinkedIn integration is not configured. Ask the admin to set up LinkedIn API credentials.';
        this.cdr.markForCheck();
    }, 500);
  }

  unlinkLinkedIn(): void {
    this.model.linkedInVerified = false;
    this.model.linkedInProfileUrl = undefined;
    this.linkedInError = '';
    this.toastService.success('LinkedIn unlinked.');
    this.cdr.markForCheck();
  }

  save(form: any): void {
    if (form.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.');
      return;
    }

    this.saving = true;
    this.model.previousStartupCount = Number(this.model.previousStartupCount) || 0;
    this.model.domainExperienceYears = Number(this.model.domainExperienceYears) || 0;
    this.model.teamSize = Number(this.model.teamSize) || 1;

    // Save identity if specified
    if (this.userModel.fullName || this.userModel.headline) {
      this.profileService.updateUserProfile(this.userModel).subscribe();
    }

    this.profileService.upsertFounderProfile(this.model).subscribe({
      next: () => {
        this.saving = false;
        this.toastService.success('Profile updated successfully!');
        this.loadCompletion();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.saving = false;
        this.toastService.error(err.error?.message || 'Failed to save profile.');
        this.cdr.markForCheck();
      }
    });
  }
}
