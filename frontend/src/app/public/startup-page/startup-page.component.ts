import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../core/config/api.config';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { AppConstants } from '../../core/constants/app.constants';

@Component({
  selector: 'app-startup-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, BadgeComponent],
  template: `
    <!-- Full-page public startup pitch -->
    <div class="min-h-screen bg-neutral-50">

      <!-- Minimal navbar for public pages -->
      <header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 font-black text-xl text-neutral-900 tracking-tight">
            <img src="/assets/images/logo.png" alt="Logo" class="h-6 w-6 rounded-lg shadow-sm" />
            {{ appName }}
          </a>
          <div class="flex items-center gap-3">
            <a routerLink="/auth/login" class="text-sm font-bold text-neutral-600 hover:text-primary-600 transition-colors">Sign in</a>
            <a routerLink="/auth/register" class="text-sm font-bold bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors">Get Started</a>
          </div>
        </div>
      </header>

      <!-- Loading -->
      <div *ngIf="isLoading" class="flex justify-center py-40">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Not Found -->
      <div *ngIf="!isLoading && !idea" class="flex flex-col items-center justify-center py-40 text-center px-4">
        <div class="text-6xl mb-6">🔍</div>
        <h1 class="text-3xl font-black text-neutral-900 mb-3">Startup not found</h1>
        <p class="text-neutral-500 mb-8">This pitch doesn't exist or has been removed.</p>
        <a routerLink="/auth/register" class="inline-flex items-center bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
          Browse Startups &rarr;
        </a>
      </div>

      <!-- Idea Content -->
      <main *ngIf="!isLoading && idea" class="max-w-5xl mx-auto px-4 sm:px-8 py-12">

        <!-- Header Card -->
        <div class="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 mb-8">
          <div class="flex flex-wrap items-center gap-3 mb-5">
            <app-badge variant="indigo">{{ idea.industry }}</app-badge>
            <app-badge variant="neutral">{{ idea.stage }}</app-badge>
            <app-badge *ngIf="idea.location" variant="primary">📍 {{ idea.location }}</app-badge>
          </div>

          <h1 class="text-4xl font-black text-neutral-900 tracking-tight mb-3 leading-tight">{{ idea.title }}</h1>
          <p class="text-lg text-neutral-500 leading-relaxed max-w-3xl">{{ idea.problem }}</p>

          <!-- CTA -->
          <div class="flex flex-wrap gap-3 mt-8">
            <a *ngIf="idea.pitchDeckUrl" [href]="idea.pitchDeckUrl" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
              📊 View Pitch Deck
            </a>
            <a *ngIf="idea.demoUrl" [href]="idea.demoUrl" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-white border border-neutral-300 text-neutral-900 font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
              🎬 Live Demo
            </a>
            <a routerLink="/auth/register"
               class="inline-flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
              💬 Contact Founder
            </a>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <!-- Solution -->
          <div class="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 class="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Our Solution</h2>
            <p class="text-neutral-800 leading-relaxed">{{ idea.solution }}</p>
          </div>

          <!-- Market & Customers -->
          <div class="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 class="text-xs font-black uppercase tracking-widest text-neutral-500 mb-3">Market Opportunity</h2>
            <div class="space-y-2">
              <div *ngIf="idea.marketSize">
                <span class="text-xs font-bold text-neutral-500">Market Size: </span>
                <span class="text-sm text-neutral-800">{{ idea.marketSize }}</span>
              </div>
              <div *ngIf="idea.targetCustomers">
                <span class="text-xs font-bold text-neutral-500">Target Customers: </span>
                <span class="text-sm text-neutral-800">{{ idea.targetCustomers }}</span>
              </div>
              <div *ngIf="idea.fundingRange">
                <span class="text-xs font-bold text-neutral-500">Funding Ask: </span>
                <span class="text-sm text-neutral-800">{{ idea.fundingRange }}</span>
              </div>
            </div>
          </div>

          <!-- Traction -->
          <div *ngIf="idea.tractionMetrics" class="bg-green-50 rounded-2xl border border-green-100 p-6">
            <h2 class="text-xs font-black uppercase tracking-widest text-green-700 mb-3">🚀 Traction</h2>
            <p class="text-neutral-800 text-sm leading-relaxed">{{ idea.tractionMetrics }}</p>
          </div>

          <!-- Second Chance Story -->
          <div *ngIf="idea.previouslyRejected" class="bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <h2 class="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">🔄 Second Chance Story</h2>
            <p class="text-sm text-neutral-700 leading-relaxed">{{ idea.whatChangedAfterRejection }}</p>
          </div>
        </div>

        <!-- Product Images -->
        <div *ngIf="idea.productImages && idea.productImages.length > 0" class="mb-8">
          <h2 class="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Product Screenshots</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img *ngFor="let img of idea.productImages" [src]="img" alt="Product screenshot"
                 class="rounded-2xl border border-neutral-200 w-full object-cover aspect-video bg-neutral-100" />
          </div>
        </div>

        <!-- Investor CTA Banner -->
        <div class="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
          <h2 class="text-2xl font-black mb-2">Are you an investor?</h2>
          <p class="text-primary-100 mb-6">Join {{ appName }} to connect directly with this founder, access the full pitch, and track this startup.</p>
          <a routerLink="/auth/register"
             class="inline-flex items-center gap-2 bg-white text-primary-700 font-black px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Get Investor Access &rarr;
          </a>
        </div>
      </main>
    </div>
  `
})
export class StartupPageComponent implements OnInit {
  appName = AppConstants.APP_NAME;

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private meta = inject(Meta);
  private title = inject(Title);

  idea: any = null;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.isLoading = false; return; }

    // Use the anonymous public endpoint (no token required)
    this.http.get<any>(`${API_CONFIG.baseUrl}/ideas/public/${id}`).subscribe({
      next: (data) => {
        this.idea = data;
        this.isLoading = false;
        this.injectSeoTags(data);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private injectSeoTags(idea: any) {
    const pageTitle = `${idea.title} — Startup Pitch | ${AppConstants.APP_NAME}`;
    this.title.setTitle(pageTitle);

    // Standard SEO
    this.meta.updateTag({ name: 'description', content: idea.problem?.substring(0, 160) ?? '' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph (LinkedIn, Facebook, iMessage)
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: idea.problem?.substring(0, 200) ?? '' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: idea.problem?.substring(0, 200) ?? '' });
  }
}
