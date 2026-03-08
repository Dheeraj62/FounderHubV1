import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DealService } from '../../core/services/deal.service';
import { Deal, DEAL_STAGES } from '../../core/models/deal.models';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
    selector: 'app-deal-pipeline',
    standalone: true,
    imports: [CommonModule, RouterLink, CardComponent, BadgeComponent],
    template: `
    <div class="h-full flex flex-col p-6 space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-h1">Deal Pipeline</h1>
        <p class="text-body mt-2">Manage and track your active startup investments.</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Kanban Board -->
      <div *ngIf="!isLoading()" class="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        <!-- Columns -->
        <div *ngFor="let stage of stages" class="flex-none w-80 flex flex-col snap-start">
          <div class="flex items-center justify-between mb-4 px-1">
            <h3 class="font-bold text-neutral-800 tracking-tight">{{ formatStageName(stage) }}</h3>
            <span class="bg-neutral-200/60 text-neutral-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {{ getDealsByStage(stage).length }}
            </span>
          </div>

          <!-- Column Content Area -->
          <div class="flex-1 bg-neutral-100/50 rounded-2xl p-3 flex flex-col gap-3 min-h-[300px]">
            <!-- Deal Cards -->
            <app-card *ngFor="let deal of getDealsByStage(stage)" 
                      [noPadding]="true"
                      [hoverable]="true" 
                      class="border border-neutral-200/70 shadow-sm cursor-grab active:cursor-grabbing">
              <div class="p-4" (click)="viewIdea(deal.ideaId)">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-bold text-neutral-900 text-sm leading-tight group-hover:text-primary-600 transition-colors">{{ deal.ideaTitle || 'Unknown Startup' }}</h4>
                  <button class="text-neutral-400 hover:text-neutral-900 focus:outline-none" (click)="removeDeal(deal, $event)">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p class="text-xs text-neutral-500 mb-4 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ deal.founderName || 'Founder' }}
                </p>

                <!-- Action Dropdown for Stage Changes (Instead of drag and drop for MVP-4 robustness) -->
                <div class="mt-pt border-t border-neutral-100 pt-3">
                  <select 
                    class="block w-full text-xs bg-neutral-50 border border-neutral-200 text-neutral-700 py-1.5 px-2 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                    [value]="deal.stage"
                    (change)="updateStage(deal, $event)"
                    (click)="$event.stopPropagation()">
                    <option *ngFor="let opt of stages" [value]="opt">{{ formatStageName(opt) }}</option>
                  </select>
                </div>
              </div>
            </app-card>

            <!-- Empty Column Placeholder -->
            <div *ngIf="getDealsByStage(stage).length === 0" class="flex-1 border-2 border-dashed border-neutral-200/60 rounded-xl flex items-center justify-center">
              <span class="text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center px-4">Drop Here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DealPipelineComponent implements OnInit {
    private dealService = inject(DealService);
    private cdr = inject(ChangeDetectorRef);

    stages = DEAL_STAGES;
    deals = signal<Deal[]>([]);
    isLoading = signal(true);

    ngOnInit(): void {
        this.loadDeals();
    }

    loadDeals() {
        this.isLoading.set(true);
        this.dealService.getDeals().subscribe({
            next: (data) => {
                this.deals.set(data);
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    getDealsByStage(stage: string): Deal[] {
        return this.deals().filter(d => d.stage === stage);
    }

    formatStageName(stage: string): string {
        // Basic formatting: "MeetingScheduled" -> "Meeting Scheduled"
        return stage.replace(/([A-Z])/g, ' $1').trim();
    }

    updateStage(deal: Deal, event: Event) {
        event.stopPropagation();
        const select = event.target as HTMLSelectElement;
        const newStage = select.value;

        if (newStage === deal.stage) return;

        // Optimistic UI update
        const previousDeals = [...this.deals()];
        this.deals.update(current =>
            current.map(d => d.id === deal.id ? { ...d, stage: newStage } : d)
        );

        this.dealService.updateDeal(deal.id, { stage: newStage, notes: deal.notes }).subscribe({
            error: () => {
                // Revert on error
                this.deals.set(previousDeals);
                this.cdr.markForCheck();
                alert('Failed to update stage. Please try again.');
            }
        });
    }

    removeDeal(deal: Deal, event: Event) {
        event.stopPropagation();
        if (!confirm('Are you sure you want to remove this startup from your pipeline?')) return;

        this.dealService.deleteDeal(deal.id).subscribe({
            next: () => {
                this.deals.update(current => current.filter(d => d.id !== deal.id));
                this.cdr.markForCheck();
            }
        });
    }

    viewIdea(ideaId: string) {
        window.location.href = `/idea/${ideaId}`;
    }
}
