import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Watchlist } from '../../core/models/watchlist.models';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
    selector: 'app-watchlist',
    standalone: true,
    imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
    template: `
    <div class="h-full flex flex-col p-4 sm:p-8 space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Watchlist</h1>
          <p class="text-neutral-500 font-medium mt-1">Track high-potential startups you aren't ready to invest in yet.</p>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && watchlists().length === 0" class="flex-1 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50">
        <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
          👀
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-2">Your watchlist is empty</h3>
        <p class="text-neutral-500 max-w-sm mb-6">Browse startups and click the "Watch" icon to add them here for later monitoring.</p>
        <app-button routerLink="/investor/browse" variant="primary">
          Browse Startups
        </app-button>
      </div>

      <!-- Grid Content -->
      <div *ngIf="!isLoading() && watchlists().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-card *ngFor="let item of watchlists()" class="hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
          <!-- Glassy decoration -->
          <div class="absolute -top-16 -right-16 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors"></div>
          
          <div class="flex-1 space-y-4 relative z-10">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {{ item.ideaIndustry }}
                </span>
                <h3 class="font-bold text-lg text-neutral-900 mt-2 line-clamp-1">{{ item.ideaTitle }}</h3>
              </div>
              <button (click)="removeFromWatchlist(item.ideaId)" class="p-2 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0" title="Remove from Watchlist">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-2 text-sm text-neutral-600 font-medium">
              <span class="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs shadow-sm border border-neutral-200">
                {{ item.founderName.charAt(0) }}
              </span>
              <span class="truncate">{{ item.founderName }}</span>
            </div>

            <p *ngIf="item.notes" class="text-xs text-neutral-500 italic bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 line-clamp-2">
              "{{ item.notes }}"
            </p>

            <div class="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-wide">{{ item.ideaStage }}</span>
              <app-button variant="ghost" size="sm" [routerLink]="['/idea', item.ideaId]" class="!px-3 !py-1">
                View Pitch &rarr;
              </app-button>
            </div>
          </div>
        </app-card>
      </div>

    </div>
  `
})
export class WatchlistComponent implements OnInit {
    private watchlistService = inject(WatchlistService);
    private toastService = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    watchlists = signal<Watchlist[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        this.loadWatchlist();
    }

    loadWatchlist() {
        this.isLoading.set(true);
        this.watchlistService.getMyWatchlist().subscribe({
            next: (data) => {
                this.watchlists.set(data);
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    async removeFromWatchlist(ideaId: string) {
        const confirmed = await this.toastService.requestConfirmation({
            title: 'Remove Watchlist Item',
            message: 'Are you sure you want to stop tracking this startup?',
            danger: true,
            confirmText: 'Remove'
        });

        if (!confirmed) return;

        // Optimistic UI updates
        const previous = [...this.watchlists()];
        this.watchlists.update(list => list.filter(w => w.ideaId !== ideaId));

        this.watchlistService.removeFromWatchlist(ideaId).subscribe({
            error: (err) => {
                this.watchlists.set(previous);
                console.error('Failed to remove from watchlist', err);
                this.toastService.error('Failed to remove from watchlist.');
            }
        });
    }
}
