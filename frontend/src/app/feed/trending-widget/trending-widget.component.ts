import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeedService } from '../../core/services/feed.service';
import { FeedItem } from '../../core/models/feed.models';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-trending-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <app-card padding="md" class="border-neutral-200/60 shadow-sm block">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
        <h3 class="text-sm font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
          <span class="text-rose-500">🔥</span> Trending
        </h3>
        <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">7 Days</span>
      </div>

      <div *ngIf="loading()" class="py-4 text-center">
        <div class="animate-spin inline-block w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>

      <div *ngIf="!loading() && items().length === 0" class="text-sm text-neutral-500 text-center py-4">
        No trending ideas yet.
      </div>

      <div class="space-y-4" *ngIf="!loading() && items().length > 0">
        <a
          *ngFor="let item of items(); let i = index"
          class="block group cursor-pointer"
          [routerLink]="item.idea ? ['/idea', item.idea.id] : ['/feed']"
        >
          <div class="flex gap-3">
            <div class="text-xl font-black text-neutral-200 group-hover:text-primary-200 transition-colors mt-0.5">
              {{ i + 1 }}
            </div>
            <div class="min-w-0">
              <h4 class="text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                {{ item.idea?.title }}
              </h4>
              <div class="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span class="font-medium text-neutral-700">@{{ item.idea?.founderUsername }}</span>
                <span>·</span>
                <span>{{ item.idea?.industry }}</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </app-card>
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

