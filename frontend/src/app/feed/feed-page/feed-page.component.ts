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

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedFilterBarComponent, FeedCardComponent, TrendingWidgetComponent],
  template: `
    <div class="app-page">
      <div class="app-page-header">
        <div>
          <h1 class="app-page-title">Network feed</h1>
          <p class="app-page-subtitle">Platform activity across ideas, pivots, and founder updates.</p>
        </div>
        <app-feed-filter-bar [mode]="mode()" (modeChange)="setMode($event)"></app-feed-filter-bar>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left -->
        <div class="lg:col-span-8 space-y-5">

        <!-- Composer (Founders) -->
        <div *ngIf="isFounder" class="app-card p-5">
          <div class="text-sm font-semibold text-gray-900">Post an update</div>
          <textarea
            [(ngModel)]="newUpdate"
            rows="3"
            class="app-input mt-3 resize-none"
            placeholder="We launched MVP today…"
          ></textarea>
          <div class="mt-3 flex items-center justify-end gap-2">
            <button type="button" class="app-btn-secondary" (click)="newUpdate=''">Clear</button>
            <button type="button" class="app-btn-primary" [disabled]="posting() || !newUpdate.trim()" (click)="postUpdate()">
              {{ posting() ? 'Posting…' : 'Post' }}
            </button>
          </div>
        </div>

        <div *ngIf="loading()" class="app-card p-6 text-sm text-gray-600">Loading feed…</div>
        <div *ngIf="!loading() && items().length === 0" class="app-card p-6 text-sm text-gray-600">
          Nothing here yet. Try switching to Global or follow a few founders/ideas.
        </div>

        <div class="space-y-4" *ngIf="!loading() && items().length > 0">
          <app-feed-card *ngFor="let item of items()" [item]="item"></app-feed-card>
        </div>
      </div>

        <!-- Right -->
        <div class="lg:col-span-4 space-y-5">
          <app-trending-widget></app-trending-widget>
          <div class="app-card p-5">
            <div class="text-sm font-semibold text-gray-900">Tips</div>
            <ul class="mt-3 text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Follow founders and ideas to personalize your feed.</li>
              <li>Founders: post updates to build credibility.</li>
              <li>Investors: express interest to surface activity.</li>
            </ul>
          </div>
        </div>
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

