import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderProfile } from '../../../core/models/profile.models';

@Component({
    selector: 'app-founder-signals',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-wrap gap-3">
      <!-- Technical Founder -->
      <div *ngIf="profile.technicalFounder" 
           class="badge group relative" 
           title="Technical expertise verified">
        <span class="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <span class="mr-1.5">💻</span> Tech Founder
        </span>
      </div>

      <!-- Serial Entrepreneur -->
      <div *ngIf="profile.previousStartupCount > 0" 
           class="badge" 
           title="Built {{ profile.previousStartupCount }} startups before">
        <span class="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <span class="mr-1.5">🔥</span> Serial Founder
        </span>
      </div>

      <!-- Domain Expert -->
      <div *ngIf="profile.domainExperienceYears >= 5" 
           class="badge" 
           title="{{ profile.domainExperienceYears }} years in current industry">
        <span class="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <span class="mr-1.5">🧠</span> Domain Expert
        </span>
      </div>

      <!-- Verified Identity -->
      <div *ngIf="profile.linkedInVerified" 
           class="badge" 
           title="Identity verified via LinkedIn">
        <span class="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <span class="mr-1.5">✅</span> Identity Verified
        </span>
      </div>

      <!-- Team -->
      <div *ngIf="profile.teamSize > 1" 
           class="badge" 
           title="{{ profile.teamSize }} active team members">
        <span class="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <span class="mr-1.5">👥</span> Active Team ({{ profile.teamSize }})
        </span>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
    .badge {
      transition: all 0.2s ease-in-out;
    }
    .badge:hover {
      transform: translateY(-2px);
      filter: brightness(1.2);
    }
  `]
})
export class FounderSignalsComponent {
    @Input() profile!: FounderProfile;
}
