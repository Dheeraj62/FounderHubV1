import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { PublicInvestorProfile } from '../../core/models/profile.models';
import { FollowService } from '../../core/services/follow.service';
import { FollowRequest } from '../../core/models/follow.models';
import { ConnectionService } from '../../core/services/connection.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-public-investor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="loading()" class="min-h-[60vh] flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>

    <div *ngIf="!loading() && !profile()" class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-2xl">💼</div>
      <h2 class="text-2xl font-bold text-neutral-900">Investor Profile Not Found</h2>
      <p class="text-neutral-500 mt-2">The investor profile you are looking for does not exist.</p>
      <a routerLink="/" class="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm">Return Home</a>
    </div>

    <div *ngIf="!loading() && profile()" class="max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-4 space-y-6">
      
      <!-- HERO CONTAINER -->
      <div class="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        
        <!-- Cover Banner -->
        <div class="h-44 sm:h-60 w-full relative bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900">
          <img *ngIf="profile()?.coverImageUrl" [src]="profile()?.coverImageUrl" alt="Cover" class="w-full h-full object-cover">
          
          <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            💼 Investor / VC
          </div>
        </div>

        <!-- Profile Bar -->
        <div class="px-6 sm:px-10 pb-8 relative">
          
          <!-- Avatar overlapping cover -->
          <div class="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div class="relative inline-block">
              <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl ring-4 ring-white shadow-xl overflow-hidden bg-emerald-50 flex items-center justify-center">
                <img *ngIf="profile()?.profilePictureUrl" [src]="profile()?.profilePictureUrl" alt="Avatar" class="w-full h-full object-cover">
                <span *ngIf="!profile()?.profilePictureUrl" class="text-4xl sm:text-5xl font-black text-emerald-700">
                  {{ (profile()?.fullName || profile()?.username || 'I')[0].toUpperCase() }}
                </span>
              </div>
              <span *ngIf="profile()?.linkedInVerified" class="absolute bottom-2 right-2 w-7 h-7 bg-[#0A66C2] text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow" title="LinkedIn Verified">
                ✓
              </span>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-3">
              <button (click)="toggleFollow()" [disabled]="followingLoading"
                      class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                      [ngClass]="isFollowing ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white'">
                <span>{{ isFollowing ? '✓ Following' : '+ Follow' }}</span>
              </button>

              <button *ngIf="currentRole === 'Founder'" (click)="connect()"
                      class="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary-600 hover:bg-primary-700 text-white transition-all shadow-sm flex items-center gap-2">
                ✉️ Pitch / Connect
              </button>
            </div>
          </div>

          <!-- User Identity -->
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {{ profile()?.fullName || profile()?.username }}
              </h1>
              <span *ngIf="profile()?.position || profile()?.investmentFirm" class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {{ profile()?.position || 'Investor' }} {{ profile()?.investmentFirm ? 'at ' + profile()?.investmentFirm : '' }}
              </span>
            </div>
            <p class="text-sm font-semibold text-emerald-600 mt-0.5">&#64;{{ profile()?.username }}</p>
            <p *ngIf="profile()?.headline" class="text-base font-medium text-neutral-700 mt-2 max-w-2xl">
              {{ profile()?.headline }}
            </p>
            <p *ngIf="profile()?.location" class="text-xs text-neutral-500 font-medium mt-2 flex items-center gap-1">
              📍 {{ profile()?.location }} · Joined {{ profile()?.joinedAt | date:'MMMM yyyy' }}
            </p>
          </div>

          <!-- Stats Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100 text-center">
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.followerCount || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Followers</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-neutral-900">{{ profile()?.companiesInvested || 0 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Portfolio Startups</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-emerald-600">{{ profile()?.averageTicketSize || 'N/A' }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Avg Ticket</div>
            </div>
            <div class="p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div class="text-xl font-black text-emerald-700">{{ profile()?.reputationScore || 100 }}</div>
              <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider">Reputation</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- LEFT COLUMN -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Investment Thesis -->
          <div *ngIf="profile()?.investmentThesis" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span>🎯</span> Investment Thesis
            </h3>
            <p class="text-neutral-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {{ profile()?.investmentThesis }}
            </p>
          </div>

          <!-- Bio -->
          <div *ngIf="profile()?.bio" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span>📖</span> About Investor
            </h3>
            <p class="text-neutral-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {{ profile()?.bio }}
            </p>
          </div>

          <!-- Portfolio Companies -->
          <div *ngIf="profile()?.portfolioCompanies && profile()!.portfolioCompanies.length > 0" class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 class="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span>📈</span> Portfolio Companies
            </h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let company of profile()?.portfolioCompanies" class="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-extrabold">
                {{ company }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN (Sidebar: Criteria & Links) -->
        <div class="space-y-6">
          
          <!-- Investment Criteria Box -->
          <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Target Criteria</h3>

            <div>
              <div class="text-xs font-bold text-neutral-500">Target Stages</div>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span *ngFor="let stg of profile()?.preferredStages" class="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-bold">
                  {{ stg }}
                </span>
                <span *ngIf="!profile()?.preferredStages || profile()!.preferredStages.length === 0" class="text-xs text-neutral-400">Open to all stages</span>
              </div>
            </div>

            <div>
              <div class="text-xs font-bold text-neutral-500">Preferred Industries</div>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span *ngFor="let ind of profile()?.preferredIndustries" class="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                  {{ ind }}
                </span>
                <span *ngIf="!profile()?.preferredIndustries || profile()!.preferredIndustries.length === 0" class="text-xs text-neutral-400">Generalist</span>
              </div>
            </div>

            <div *ngIf="profile()?.ticketSizeRange">
              <div class="text-xs font-bold text-neutral-500">Target Round Size</div>
              <div class="text-sm font-extrabold text-neutral-900 mt-0.5">{{ profile()?.ticketSizeRange }}</div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">Web Links</h3>

            <a *ngIf="profile()?.website" [href]="profile()?.website" target="_blank" class="flex items-center gap-3 text-sm font-bold text-neutral-700 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-neutral-50">
              <span>🌐</span> Website
            </a>

            <a *ngIf="profile()?.linkedInProfileUrl" [href]="profile()?.linkedInProfileUrl" target="_blank" class="flex items-center gap-3 text-sm font-bold text-[#0A66C2] transition-colors p-2 rounded-xl hover:bg-blue-50">
              <span>💼</span> LinkedIn Profile
            </a>

            <a *ngIf="profile()?.angelListProfile" [href]="profile()?.angelListProfile" target="_blank" class="flex items-center gap-3 text-sm font-bold text-neutral-800 transition-colors p-2 rounded-xl hover:bg-neutral-100">
              <span>✌️</span> AngelList Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PublicInvestorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private followService = inject(FollowService);
  private connectionService = inject(ConnectionService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  profile = signal<PublicInvestorProfile | null>(null);
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
    this.profileService.getPublicInvestorProfile(username).subscribe({
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

    this.followService.getFollowing('INVESTOR').subscribe({
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
    const req: FollowRequest = { followingId: targetId, type: 'INVESTOR' as const };
    if (this.isFollowing) {
      this.followService.unfollow(req).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followingLoading = false;
          this.toastService.success('Unfollowed investor');
          this.cdr.markForCheck();
        },
        error: () => { this.followingLoading = false; }
      });
    } else {
      this.followService.follow(req).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followingLoading = false;
          this.toastService.success('Now following investor');
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
