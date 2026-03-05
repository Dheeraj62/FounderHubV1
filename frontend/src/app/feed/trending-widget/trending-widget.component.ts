import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeedService } from '../../core/services/feed.service';
import { FeedItem } from '../../core/models/feed.models';

@Component({
  selector: 'app-trending-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app-card p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900">Trending Ideas</h3>
        <span class="text-xs text-gray-500">last 7 days</span>
      </div>

      <div *ngIf="loading()" class="text-sm text-gray-500">Loading…</div>

      <div *ngIf="!loading() && items().length === 0" class="text-sm text-gray-500">
        No trending ideas yet.
      </div>

      <div class="space-y-3" *ngIf="!loading() && items().length > 0">
        <a
          *ngFor="let item of items()"
          class="block p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
          [routerLink]="item.idea ? ['/idea', item.idea.id] : ['/feed']"
        >
          <div class="text-xs text-gray-500 flex items-center justify-between">
            <span>{{ item.idea?.industry }} • {{ item.idea?.stage }}</span>
            <span class="font-medium text-cyan-700">Trending</span>
          </div>
          <div class="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
            {{ item.idea?.title }}
          </div>
          <div class="mt-1 text-xs text-gray-500">
            by @{{ item.idea?.founderUsername }}
          </div>
        </a>
      </div>
    </div>
  `,
})
export class TrendingWidgetComponent implements OnInit {
  private feed = inject(FeedService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  items = signal<FeedItem[]>([]);

  ngOnInit(): void {
    this.loading.set(true);
    this.feed.getTrending(5).subscribe({
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
}

