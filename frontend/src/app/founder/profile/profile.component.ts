import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertFounderProfileRequest, FounderProfile } from '../../core/models/profile.models';

@Component({
  selector: 'app-founder-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-10 px-4">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
          <h1 class="text-3xl font-bold text-white">Founder Profile</h1>
          <p class="text-indigo-100 mt-2">Build your credibility to attract the best investors.</p>
        </div>

        <form (ngSubmit)="save()" class="p-8 space-y-8">
          <!-- Verification Status -->
          <div class="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🔗</span>
              <div>
                <h3 class="font-bold text-gray-200">LinkedIn Verification</h3>
                <p class="text-xs text-gray-500">Connecting your LinkedIn increases trust by 3x.</p>
              </div>
            </div>
            <button type="button" 
                    (click)="model.linkedInVerified = !model.linkedInVerified"
                    [class]="model.linkedInVerified ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all">
              {{ model.linkedInVerified ? 'Verified ✓' : 'Verify Now' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Expertise -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-indigo-400 border-b border-gray-800 pb-2">Expertise & Experience</h3>
              
              <div class="flex items-center justify-between">
                <label class="text-gray-300">Technical Founder?</label>
                <input type="checkbox" [(ngModel)]="model.technicalFounder" name="tech" 
                       class="w-5 h-5 rounded border-gray-700 bg-gray-800 text-indigo-600">
              </div>

              <div>
                <label class="block text-sm text-gray-500 mb-1">Previous Startups Built</label>
                <input type="number" [(ngModel)]="model.previousStartupCount" name="startups"
                       class="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white">
              </div>

              <div>
                <label class="block text-sm text-gray-500 mb-1">Years of Domain Experience</label>
                <input type="number" [(ngModel)]="model.domainExperienceYears" name="xp"
                       class="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white">
              </div>
            </div>

            <!-- Team & Bio -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-indigo-400 border-b border-gray-800 pb-2">Venture Details</h3>
              
              <div>
                <label class="block text-sm text-gray-500 mb-1">Core Team Size</label>
                <input type="number" [(ngModel)]="model.teamSize" name="team"
                       class="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white">
              </div>

              <div>
                <label class="block text-sm text-gray-500 mb-1">Primary Location</label>
                <input type="text" [(ngModel)]="model.location" name="loc" placeholder="City, Country"
                       class="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-500 mb-1">Founder Bio (Pitch yourself)</label>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4"
                      class="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white"></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" 
                    class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
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

  save() {
    this.profileService.upsertFounderProfile(this.model).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: (err) => {
        console.error('Error saving founder profile:', err);
        alert('Failed to save profile. Status: ' + (err.status || 'Unknown'));
      }
    });
  }
}
