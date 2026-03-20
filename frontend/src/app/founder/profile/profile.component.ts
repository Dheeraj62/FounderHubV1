import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertFounderProfileRequest } from '../../core/models/profile.models';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-founder-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-10 px-4">
      <div class="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
        <div class="bg-primary-50 border-b border-primary-100 p-8 text-center sm:text-left">
          <h1 class="text-3xl font-bold text-neutral-900">Founder Profile</h1>
          <p class="text-primary-700 mt-2">Build your credibility to attract the best investors.</p>
        </div>

        <form #profileForm="ngForm" (ngSubmit)="save(profileForm)" class="p-8 space-y-8">
          <!-- Verification Status -->
          <div class="flex items-center justify-between p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🔗</span>
              <div>
                <h3 class="font-bold text-primary-900">LinkedIn Verification</h3>
                <p class="text-xs text-primary-600">Connecting your LinkedIn increases trust by 3x.</p>
              </div>
            </div>
            <button type="button" 
                    (click)="model.linkedInVerified = !model.linkedInVerified"
                    [class]="model.linkedInVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
              {{ model.linkedInVerified ? 'Verified ✓' : 'Verify Now' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Expertise -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-primary-600 border-b border-neutral-200 pb-2">Expertise & Experience</h3>
              
              <div class="flex items-center justify-between">
                <label class="text-neutral-700 font-medium text-sm">Technical Founder?</label>
                <input type="checkbox" [(ngModel)]="model.technicalFounder" name="tech" 
                       class="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Previous Startups Built</label>
                <input type="number" [(ngModel)]="model.previousStartupCount" name="startups"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Years of Domain Experience</label>
                <input type="number" [(ngModel)]="model.domainExperienceYears" name="xp"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              </div>
            </div>

            <!-- Team & Bio -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-primary-600 border-b border-neutral-200 pb-2">Venture Details</h3>
              
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Core Team Size</label>
                <input type="number" [(ngModel)]="model.teamSize" name="team"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Primary Location <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.location" name="loc" placeholder="City, Country" required
                       class="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Founder Bio (Pitch yourself) <span class="text-red-500">*</span></label>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4" required placeholder="Tell investors about yourself..."
                      class="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" [disabled]="profileForm.invalid"
                    class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-500/30">
              Save Profile
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
  
  model: UpsertFounderProfileRequest = {
    technicalFounder: false,
    previousStartupCount: 0,
    domainExperienceYears: 0,
    teamSize: 1,
    linkedInVerified: false,
    bio: '',
    location: ''
  };

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
            bio: p.bio,
            location: p.location
          };
          this.cdr.markForCheck();
        },
        error: () => { } // Profile likely doesn't exist yet
      });
    }
  }

  save(form: any) {
    if (form.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.');
      return;
    }

    // Safely parse numbers to avoid .NET Int32 JSON binding errors on empty strings
    this.model.previousStartupCount = Number(this.model.previousStartupCount) || 0;
    this.model.domainExperienceYears = Number(this.model.domainExperienceYears) || 0;
    this.model.teamSize = Number(this.model.teamSize) || 1;

    this.profileService.upsertFounderProfile(this.model).subscribe({
      next: () => this.toastService.success('Profile updated successfully!'),
      error: (err: any) => {
        console.error('Error saving founder profile:', err);
        let errorMsg = 'Failed to save profile. Status: ' + (err.status || 'Unknown');
        if (err.status === 400 && err.error?.errors) {
            // Flatten the .NET validation errors object into a readable string
            errorMsg = Object.values<{[_: string]: string[]}>(err.error.errors).flat().join(' ');
        } else if (err.status === 400 && typeof err.error === 'string') {
            errorMsg = err.error;
        }
        this.toastService.error(errorMsg);
      }
    });
  }
}
