import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileCompletion } from '../../../core/models/profile.models';

@Component({
  selector: 'app-profile-completion-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="completion() && completion()!.percent < 100" class="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-black uppercase tracking-widest text-neutral-500">Profile Strength</h3>
        <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
              [ngClass]="completion()!.percent >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
          {{ completion()!.percent }}%
        </span>
      </div>

      <div class="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
        <div class="h-2 rounded-full transition-all duration-500"
             [ngClass]="completion()!.percent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'"
             [style.width.%]="completion()!.percent"></div>
      </div>

      <div *ngIf="completion()!.missingFields.length > 0">
        <p class="text-xs font-semibold text-neutral-600 mb-1">Add to boost visibility:</p>
        <div class="flex flex-wrap gap-1">
          <span *ngFor="let item of completion()!.missingFields.slice(0, 3)" class="text-[11px] font-bold px-2 py-0.5 bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md">
            + {{ item }}
          </span>
        </div>
      </div>

      <a [routerLink]="['/', role?.toLowerCase(), 'profile']" class="block text-center text-xs font-extrabold text-primary-600 hover:text-primary-700 pt-1">
        Complete Profile →
      </a>
    </div>
  `
})
export class ProfileCompletionWidgetComponent implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  completion = signal<ProfileCompletion | null>(null);
  role = this.authService.getUserRole();

  ngOnInit(): void {
    this.profileService.getProfileCompletion().subscribe({
      next: (res) => {
        this.completion.set(res);
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }
}
