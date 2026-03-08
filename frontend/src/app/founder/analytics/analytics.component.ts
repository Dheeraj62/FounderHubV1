import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { FounderAnalyticsSummary, IdeaAnalytics } from '../../core/models/analytics.models';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, RouterLink, CardComponent],
    template: `
    <div class="h-full flex flex-col p-4 sm:p-8 space-y-8">

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Analytics Dashboard</h1>
        <p class="text-neutral-500 font-medium mt-1">Track investor engagement and idea performance.</p>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <ng-container *ngIf="!isLoading() && summary()">
        <!-- Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <app-card class="text-center">
            <div class="text-4xl font-black text-primary-600">{{ summary()!.totalIdeas }}</div>
            <div class="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">Ideas Posted</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-4xl font-black text-sky-600">{{ summary()!.totalViews }}</div>
            <div class="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">Total Views</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-4xl font-black text-emerald-600">{{ summary()!.totalHighlyInterested }}</div>
            <div class="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">🔥 Highly Interested</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-4xl font-black text-amber-500">{{ summary()!.totalMaybe }}</div>
            <div class="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2">🤔 Keep in Touch</div>
          </app-card>
        </div>

        <!-- Per-Idea Breakdown -->
        <div>
          <h2 class="text-lg font-bold text-neutral-800 mb-4">Idea Breakdown</h2>

          <div *ngIf="summary()!.ideaBreakdown.length === 0" class="flex flex-col items-center py-16 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
            <span class="text-5xl mb-4">📊</span>
            <p class="text-neutral-500 font-medium">No ideas yet. Post an idea and watch the analytics roll in!</p>
          </div>

          <div class="space-y-4" *ngIf="summary()!.ideaBreakdown.length > 0">
            <app-card *ngFor="let idea of summary()!.ideaBreakdown" class="hover:shadow-md transition-shadow">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Title & Meta -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <span class="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{{ idea.industry }}</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">{{ idea.stage }}</span>
                  </div>
                  <h3 class="text-base font-bold text-neutral-900 truncate">{{ idea.ideaTitle }}</h3>
                  <p class="text-xs text-neutral-400 mt-0.5">Posted {{ idea.createdAt | date:'mediumDate' }}</p>
                </div>

                <!-- Metrics -->
                <div class="flex items-center gap-6 shrink-0">
                  <div class="text-center">
                    <div class="text-2xl font-black text-sky-600">{{ idea.totalViews }}</div>
                    <div class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Views</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-black text-emerald-600">{{ idea.highlyInterestedCount }}</div>
                    <div class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">🔥 Hot</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-black text-amber-500">{{ idea.maybeCount }}</div>
                    <div class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">🤔 Maybe</div>
                  </div>
                  <a [routerLink]="['/idea', idea.ideaId]" class="ml-4 px-4 py-2 bg-primary-50 text-primary-700 text-xs font-bold rounded-xl hover:bg-primary-100 transition-colors">
                    View →
                  </a>
                </div>
              </div>

              <!-- Progress bar: views out of max -->
              <div class="mt-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary-500 to-sky-400 rounded-full transition-all duration-700"
                     [style.width.%]="getViewPercent(idea.totalViews)"></div>
              </div>
            </app-card>
          </div>
        </div>
      </ng-container>

    </div>
  `
})
export class AnalyticsComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);
    private cdr = inject(ChangeDetectorRef);

    summary = signal<FounderAnalyticsSummary | null>(null);
    isLoading = signal(true);

    ngOnInit() {
        this.analyticsService.getMyAnalytics().subscribe({
            next: (data) => {
                this.summary.set(data);
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    getViewPercent(views: number): number {
        const breakdown = this.summary()?.ideaBreakdown ?? [];
        const max = Math.max(...breakdown.map(b => b.totalViews), 1);
        return Math.round((views / max) * 100);
    }
}
