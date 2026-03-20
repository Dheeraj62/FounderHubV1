import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { Idea } from '../../core/models/idea.models';
import { InterestService } from '../../core/services/interest.service';
import { ToastService } from '../../shared/ui/toast/toast.service';

import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-founder-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-h1">My Ideas</h1>
          <p class="text-body mt-2">Manage and track your startup concepts.</p>
        </div>
        <app-button variant="primary" (onClick)="router.navigate(['/founder/create-idea'])">
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Post New Idea
        </app-button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && ideas().length === 0">
        <app-card class="text-center py-20" padding="lg">
          <div class="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="text-h3">No ideas yet</h3>
          <p class="text-body mt-2 mb-6 max-w-sm mx-auto">Get started by posting your first startup idea and see how investors react.</p>
          <app-button variant="primary" (onClick)="router.navigate(['/founder/create-idea'])">
            Post Idea
          </app-button>
        </app-card>
      </div>

      <!-- Content Grid -->
      <div *ngIf="!isLoading() && ideas().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-card *ngFor="let idea of ideas()" [hoverable]="true" [hasFooter]="true" padding="md" class="flex flex-col h-full">
          <div class="flex items-center gap-2 mb-4">
             <app-badge variant="indigo">{{ idea.industry }}</app-badge>
             <app-badge variant="neutral">{{ idea.stage }}</app-badge>
          </div>
          
          <h3 class="text-h3 mb-2 line-clamp-1" [title]="idea.title">{{ idea.title }}</h3>
          <p class="text-body text-sm line-clamp-3 mb-6 flex-grow">{{ idea.problem }}</p>
          
          <!-- Metrics -->
          <div class="grid grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100 mt-auto">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">High Interest</span>
              <span class="text-2xl font-bold text-primary-600">{{ getInterestCount(idea.id, 'interestedCount') }}</span>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-1">Maybe</span>
              <span class="text-2xl font-bold text-neutral-900">{{ getInterestCount(idea.id, 'maybeCount') }}</span>
            </div>
          </div>

          <!-- Footer Area -->
          <ng-container card-footer>
            <span class="text-xs text-neutral-500 font-medium">{{ idea.createdAt | date:'MMM d, y' }}</span>
            <div class="flex items-center gap-2">
              <app-button variant="ghost" size="sm" (onClick)="router.navigate(['/founder/edit-idea', idea.id])">Edit</app-button>
              <app-button variant="danger" size="sm" (onClick)="deleteIdea(idea.id)">Delete</app-button>
            </div>
          </ng-container>
        </app-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  router = inject(Router);
  private ideaService = inject(IdeaService);
  private interestService = inject(InterestService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Use Signals for zoneless change detection
  ideas = signal<Idea[]>([]);
  isLoading = signal(true);
  interestCounts = signal<{ [ideaId: string]: { interestedCount: number, maybeCount: number } }>({});

  ngOnInit(): void {
    this.loadIdeas();
  }

  loadIdeas() {
    this.isLoading.set(true);
    this.ideaService.getMyIdeas().subscribe({
      next: (ideas) => {
        this.ideas.set(ideas);
        this.isLoading.set(false);
        this.cdr.markForCheck();

        // Fetch interest counts for each idea
        ideas.forEach(idea => {
          this.interestService.getInterestCount(idea.id).subscribe({
            next: (count) => {
              this.interestCounts.update(prev => ({
                ...prev,
                [idea.id]: count
              }));
              this.cdr.markForCheck();
            }
          });
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  getInterestCount(ideaId: string, field: 'interestedCount' | 'maybeCount'): number {
    return this.interestCounts()[ideaId]?.[field] ?? 0;
  }

  async deleteIdea(id: string) {
    const confirmed = await this.toastService.requestConfirmation({
      title: 'Delete Startup Idea',
      message: 'Are you sure you want to permanently delete this idea? All associated data and metrics will be lost.',
      danger: true,
      confirmText: 'Delete Idea'
    });

    if (confirmed) {
      this.ideaService.deleteIdea(id).subscribe({
        next: () => {
          this.ideas.update(prev => prev.filter(i => i.id !== id));
          this.cdr.markForCheck();
        }
      });
    }
  }
}
