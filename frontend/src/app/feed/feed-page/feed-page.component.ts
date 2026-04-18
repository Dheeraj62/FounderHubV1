import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../core/services/feed.service';
import { FeedItem } from '../../core/models/feed.models';
import { FeedFilterBarComponent, FeedMode } from '../feed-filter-bar/feed-filter-bar.component';
import { FeedCardComponent } from '../feed-card/feed-card.component';
import { TrendingWidgetComponent } from '../trending-widget/trending-widget.component';
import { AuthService } from '../../core/services/auth.service';
import { FounderUpdatesService } from '../../core/services/founder-updates.service';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedFilterBarComponent, FeedCardComponent, TrendingWidgetComponent, CardComponent, ButtonComponent],
  template: `
    <div class="flex gap-8 items-start w-full">
      <!-- CENTER FEED: max-w-3xl -->
      <div class="flex-1 w-full max-w-3xl mx-auto space-y-6">
        
        <div class="mb-6">
          <h1 class="text-h1">Network feed</h1>
          <p class="text-body">Platform activity across ideas, pivots, and founder updates.</p>
          <div class="mt-6">
            <app-feed-filter-bar [mode]="mode()" (modeChange)="setMode($event)"></app-feed-filter-bar>
          </div>
        </div>

        <!-- Composer (Founders) -->
        <div *ngIf="isFounder">
          <app-card padding="md" class="hover:border-neutral-300 transition-colors">
            <h3 class="text-sm font-black text-neutral-900 uppercase tracking-widest mb-3">Post an update</h3>
            <textarea
              [(ngModel)]="newUpdate"
              rows="3"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-200 resize-none"
              placeholder="We launched MVP today…"
            ></textarea>
            <div class="mt-4 flex items-center justify-end gap-3">
              <app-button variant="ghost" size="sm" (onClick)="newUpdate=''">Clear</app-button>
              <app-button variant="primary" size="sm" [disabled]="posting() || !newUpdate.trim()" (onClick)="postUpdate()">
                {{ posting() ? 'Posting…' : 'Post Update' }}
              </app-button>
            </div>
          </app-card>
        </div>

        <div *ngIf="loading()" class="py-12 text-center text-sm font-medium text-neutral-500">
          <div class="animate-spin inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mb-2"></div>
          <p>Loading activity feed...</p>
        </div>
        
        <div *ngIf="!loading() && items().length === 0">
          <app-card padding="lg" class="text-center py-16">
            <div class="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-h3 text-neutral-900">It's quiet here</h3>
            <p class="text-body mt-2 max-w-sm mx-auto">Try switching to Global view or matching with more founders and ideas.</p>
          </app-card>
        </div>

        <div class="space-y-6 pb-20" *ngIf="!loading() && items().length > 0">
          <app-feed-card *ngFor="let item of items()" [item]="item"></app-feed-card>
        </div>
      </div>

      <!-- RIGHT WIDGETS -->
      <div class="hidden lg:block w-[300px] shrink-0 space-y-6 pt-[120px]">
        <app-trending-widget></app-trending-widget>
        
        <app-card padding="md" class="bg-gradient-to-br from-neutral-50 to-neutral-100/50 border-neutral-200/60">
          <h3 class="text-xs font-black text-neutral-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="text-primary-500">💡</span> Pro Tips
          </h3>
          <ul class="text-sm text-neutral-600 space-y-3 font-medium">
            <li class="flex items-start gap-2">
              <div class="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"></div>
              <span>Follow founders and ideas to personalize your feed.</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
              <span>Founders: post updates to build credibility.</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
              <span>Investors: express interest to surface activity.</span>
            </li>
          </ul>
        </app-card>
      </div>
    </div>
  `,
})
export class FeedPageComponent implements OnInit {
  private feed = inject(FeedService);
  private auth = inject(AuthService);
  private updates = inject(FounderUpdatesService);
  private cdr = inject(ChangeDetectorRef);

  mode = signal<FeedMode>('global');
  loading = signal(true);
  items = signal<FeedItem[]>([]);

  isFounder = this.auth.getRole() === 'Founder';
  newUpdate = '';
  posting = signal(false);

  ngOnInit(): void {
    this.isFounder = this.auth.getRole() === 'Founder';
    this.load();
  }

  setMode(mode: FeedMode) {
    this.mode.set(mode);
    this.load();
  }

  load() {
    this.loading.set(true);
    const req = this.mode() === 'following' ? this.feed.getFollowing() : this.feed.getGlobal();
    req.subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  postUpdate() {
    const content = this.newUpdate.trim();
    if (!content) return;
    this.posting.set(true);
    this.updates.create(content).subscribe({
      next: () => {
        this.newUpdate = '';
        this.posting.set(false);
        this.load();
        this.cdr.markForCheck();
      },
      error: () => {
        this.posting.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}

