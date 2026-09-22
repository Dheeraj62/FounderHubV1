import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { PublicFounderProfile } from '../../core/models/profile.models';
import { FollowService } from '../../core/services/follow.service';
import { FollowRequest } from '../../core/models/follow.models';
import { ConnectionService } from '../../core/services/connection.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';

@Component({
  selector: 'app-public-founder-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  template: `
    <div *ngIf="loading()" class="min-h-[60vh] flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>

    <div *ngIf="!loading() && !profile()" class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-2xl">👤</div>
      <h2 class="text-2xl font-bold text-neutral-900">Founder Profile Not Found</h2>
      <p class="text-neutral-500 mt-2">The user profile you are looking for does not exist or is private.</p>
      <a routerLink="/" class="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm">Return Home</a>
    </div>

    <div *ngIf="!loading() && profile()" class="max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-4 space-y-6">
      
      <!-- HERO CONTAINER (Cover + Avatar + Main Info) -->
      <div class="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        
        <!-- Cover Banner -->
        <div class="h-44 sm:h-60 w-full relative bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900">
          <img *ngIf="profile()?.coverImageUrl" [src]="profile()?.coverImageUrl" alt="Cover" class="w-full h-full object-cover">
          
          <!-- Role Badge -->
          <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            🚀 Founder
          </div>
        </div>

        <!-- Profile Bar -->
        <div class="px-6 sm:px-10 pb-8 relative">
          
          <!-- Avatar overlapping cover -->
          <div class="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div class="relative inline-block">
              <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl ring-4 ring-white shadow-xl overflow-hidden bg-primary-50 flex items-center justify-center">
                <img *ngIf="profile()?.profilePictureUrl" [src]="profile()?.profilePictureUrl" alt="Avatar" class="w-full h-full object-cover">
                <span *ngIf="!profile()?.profilePictureUrl" class="text-4xl sm:text-5xl font-black text-primary-700">
                  {{ (profile()?.fullName || profile()?.username || 'F')[0].toUpperCase() }}
                </span>
              </div>
              <span *ngIf="profile()?.linkedInVerified" class="absolute bottom-2 right-2 w-7 h-7 bg-[#0A66C2] text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow" title="LinkedIn Verified">
                ✓
              </span>
            </div>

            <!-- Actions (Follow, Connect) -->
            <div class="flex flex-wrap items-center gap-3">
              <button (click)="toggleFollow()" [disabled]="followingLoading"
                      class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                      [ngClass]="isFollowing ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300' : 'bg-primary-600 hover:bg-primary-700 text-white'">
                <span>{{ isFollowing ? '✓ Following' : '+ Follow' }}</span>
              </button>

              <button *ngIf="currentRole === 'Investor'" (click)="connect()"
                      class="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-2">
                💬 Connect / Pitch
              </button>
            </div>
          </div>

          <!-- User Identity -->
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {{ profile()?.fullName || profile()?.username }}
              </h1>
              <span *ngIf="profile()?.emailVerified" class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                ✓ Verified Email
              </span>
            </div>
            <p class="text-sm font-semibold text-primary-600 mt-0.5">&#64;{{ profile()?.username }}</p>
            <p *ngIf="profile()?.headline" class="text-base font-medium text-neutral-700 mt-2 max-w-2xl">
              {{ profile()?.headline }}
            </p>
            <p *ngIf="profile()?.location" class="text-xs text-neutral-500 font-medium mt-2 flex items-center gap-1">
              📍 {{ profile()?.location }} · Joined {{ profile()?.joinedAt | date:'MMMM yyyy' }}
            </p>
          </div>

          <!-- Stats Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-neutral-100 text-center">
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.followerCount || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Followers</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.ideaCount || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Startups</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.totalIdeaViews || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Idea Views</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.investorInterestCount || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Investor Signals</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 col-span-2 sm:col-span-1">
              <div class="text-xl font-black text-primary-600">{{ profile()?.reputationScore || 100 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Reputation</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- LEFT COLUMN (Bio, Experience, Looking For) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- About / Bio -->
          <div *ngIf="profile()?.bio" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span>📖</span> About Founder
            </h3>
            <p class="text-neutral-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {{ profile()?.bio }}
            </p>
          </div>

          <!-- Venture Context -->
          <div *ngIf="profile()?.currentStartup" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span>🚀</span> Current Venture
            </h3>
            <div class="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-center justify-between">
              <div>
                <h4 class="font-extrabold text-primary-900 text-lg">{{ profile()?.currentStartup }}</h4>
                <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mt-0.5">Stage: {{ profile()?.startupStage || 'Early' }}</p>
              </div>
              <a *ngIf="profile()?.startupWebsite" [href]="profile()?.startupWebsite" target="_blank" class="px-4 py-2 bg-white text-primary-700 font-bold rounded-xl text-xs border border-primary-200 shadow-sm hover:bg-primary-50">
                Visit Website ↗
              </a>
            </div>
          </div>

          <!-- Experience Highlights -->
          <div class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span>⚡</span> Track Record & Metrics
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div class="text-xs font-bold text-neutral-500">Technical Founder</div>
                <div class="text-base font-extrabold text-neutral-900 mt-1">
                  {{ profile()?.technicalFounder ? '✓ Yes' : 'No' }}
                </div>
              </div>

              <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div class="text-xs font-bold text-neutral-500">Prior Startups</div>
                <div class="text-base font-extrabold text-neutral-900 mt-1">
                  {{ profile()?.previousStartupCount || 0 }} built
                </div>
              </div>

              <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div class="text-xs font-bold text-neutral-500">Domain Experience</div>
                <div class="text-base font-extrabold text-neutral-900 mt-1">
                  {{ profile()?.domainExperienceYears || 0 }} yrs
                </div>
              </div>

              <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div class="text-xs font-bold text-neutral-500">Core Team</div>
                <div class="text-base font-extrabold text-neutral-900 mt-1">
                  {{ profile()?.teamSize || 1 }} members
                </div>
              </div>
            </div>
          </div>

          <!-- Looking For -->
          <div *ngIf="profile()?.lookingFor && profile()!.lookingFor.length > 0" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span>🎯</span> Currently Looking For
            </h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let item of profile()?.lookingFor" class="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                ✓ {{ item }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN (Sidebar: Links, Skills, Industries) -->
        <div class="space-y-6">
          
          <!-- Social Links -->
          <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">Web & Social</h3>

            <a *ngIf="profile()?.website" [href]="profile()?.website" target="_blank" class="flex items-center gap-3 text-sm font-bold text-neutral-700 hover:text-primary-600 transition-colors p-2 rounded-xl hover:bg-neutral-50">
              <span>🌐</span> Website
            </a>

            <a *ngIf="profile()?.linkedInProfileUrl" [href]="profile()?.linkedInProfileUrl" target="_blank" class="flex items-center gap-3 text-sm font-bold text-[#0A66C2] transition-colors p-2 rounded-xl hover:bg-blue-50">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn Profile
            </a>

            <a *ngIf="profile()?.gitHubUrl" [href]="profile()?.gitHubUrl" target="_blank" class="flex items-center gap-3 text-sm font-bold text-neutral-800 transition-colors p-2 rounded-xl hover:bg-neutral-100">
              <span>💻</span> GitHub
            </a>

            <a *ngIf="profile()?.twitterUrl" [href]="profile()?.twitterUrl" target="_blank" class="flex items-center gap-3 text-sm font-bold text-neutral-800 transition-colors p-2 rounded-xl hover:bg-neutral-100">
              <span>𝕏</span> X (Twitter)
            </a>
          </div>

          <!-- Skills Tag Cloud -->
          <div *ngIf="profile()?.skills && profile()!.skills.length > 0" class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
            <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">Skills & Expertise</h3>
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let skill of profile()?.skills" class="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PublicFounderProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private followService = inject(FollowService);
  private connectionService = inject(ConnectionService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  profile = signal<PublicFounderProfile | null>(null);
  isFollowing = false;
  followingLoading = false;
  currentRole = this.authService.getUserRole();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.loadProfile(username);
      }
    });
  }

  loadProfile(username: string): void {
    this.loading.set(true);
    this.profileService.getPublicFounderProfile(username).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
        this.checkFollowing();
        this.cdr.markForCheck();
      },
      error: () => {
        this.profile.set(null);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  checkFollowing(): void {
    const targetId = this.profile()?.userId;
    if (!targetId) return;

    this.followService.getFollowing('FOUNDER').subscribe({
      next: (list) => {
        this.isFollowing = list.some(f => f.followingId === targetId);
        this.cdr.markForCheck();
      }
    });
  }

  toggleFollow(): void {
    const targetId = this.profile()?.userId;
    if (!targetId) return;

    this.followingLoading = true;
    const req: FollowRequest = { followingId: targetId, type: 'FOUNDER' as const };
    if (this.isFollowing) {
      this.followService.unfollow(req).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followingLoading = false;
          this.toastService.success('Unfollowed founder');
          this.cdr.markForCheck();
        },
        error: () => { this.followingLoading = false; }
      });
    } else {
      this.followService.follow(req).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followingLoading = false;
          this.toastService.success('Now following founder');
          this.cdr.markForCheck();
        },
        error: () => { this.followingLoading = false; }
      });
    }
  }

  connect(): void {
    const targetId = this.profile()?.userId;
    if (!targetId) return;

    this.connectionService.sendRequest({ founderId: targetId }).subscribe({
      next: () => this.toastService.success('Connection request sent!'),
      error: (err) => this.toastService.error(err.error?.message || 'Connection request failed.')
    });
  }
}
