import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { InterestService } from '../../core/services/interest.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Idea } from '../../core/models/idea.models';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-browse-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-h1">Discover Ideas</h1>
          <p class="text-body mt-2">Find the next big thing and connect with visionary founders.</p>
        </div>
      </div>

      <!-- Filters -->
      <app-card padding="md" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Stage</label>
            <select [(ngModel)]="filters.stage" (change)="loadIdeas(1)" class="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200">
              <option value="">All Stages</option>
              <option value="Idea">Idea Only</option>
              <option value="MVP">MVP Built</option>
              <option value="EarlyRevenue">Early Revenue</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Industry</label>
            <select [(ngModel)]="filters.industry" (change)="loadIdeas(1)" class="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200">
              <option value="">All Industries</option>
              <option value="SaaS">SaaS</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthtech">Healthtech</option>
              <option value="Edtech">Edtech</option>
              <option value="AI / ML">AI / ML</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Web3">Web3</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Previously Rejected?</label>
            <select [(ngModel)]="filters.previouslyRejected" (change)="loadIdeas(1)" class="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200">
              <option value="">Any</option>
              <option [ngValue]="true">Yes</option>
              <option [ngValue]="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Location</label>
            <input [(ngModel)]="filters.location" (input)="loadIdeas(1)" type="text" placeholder="e.g. San Francisco"
              class="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200" />
          </div>
          <div class="sm:col-span-2 lg:col-span-1">
            <label class="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Keyword</label>
            <input [(ngModel)]="filters.keyword" (input)="loadIdeas(1)" type="text" placeholder="Search titles, problems..."
              class="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200" />
          </div>
          <div>
            <app-button variant="secondary" [fullWidth]="true" (onClick)="resetFilters()">
              Reset Filters
            </app-button>
          </div>
        </div>
      </app-card>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && ideas().length === 0">
        <app-card class="text-center py-20" padding="lg">
          <div class="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-h3">No ideas found</h3>
          <p class="text-body mt-2 max-w-sm mx-auto">Try adjusting your filters to see more startup concepts.</p>
        </app-card>
      </div>

      <!-- Content List -->
      <div *ngIf="!isLoading() && ideas().length > 0" class="space-y-6 max-w-4xl mx-auto">
        <app-card *ngFor="let idea of ideas()" [hoverable]="true" padding="lg">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <app-badge variant="indigo">{{ idea.industry }}</app-badge>
                <app-badge variant="neutral">{{ idea.stage }}</app-badge>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs font-medium text-neutral-500">Posted {{ idea.createdAt | date:'MMM d, y' }}</span>
                <button (click)="toggleWatchlist(idea.id); $event.stopPropagation()" 
                        [class]="isWatchlisted(idea.id) ? 'text-primary-500 bg-primary-50 hover:bg-primary-100' : 'text-neutral-400 hover:text-primary-500 hover:bg-primary-50'"
                        class="p-2 rounded-full transition-colors flex items-center justify-center shrink-0" 
                        title="Watchlist">
                  <span class="text-xl leading-none">{{ isWatchlisted(idea.id) ? '👀' : '👁️' }}</span>
                </button>
              </div>
            </div>

            <h3 class="text-h2 mb-4">{{ idea.title }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 class="text-xs font-black text-neutral-900 uppercase tracking-widest mb-3">The Problem</h4>
                <p class="text-body text-sm whitespace-pre-line">{{ idea.problem }}</p>
              </div>
              <div>
                <h4 class="text-xs font-black text-neutral-900 uppercase tracking-widest mb-3">The Solution</h4>
                <p class="text-body text-sm whitespace-pre-line">{{ idea.solution }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100 mb-6">
              <div *ngIf="idea.fundingRange">
                <span class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Target Funding</span>
                <span class="block text-sm font-bold text-neutral-900">{{ idea.fundingRange }}</span>
              </div>
              <div *ngIf="idea.previouslyRejected">
                <span class="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Previously Rejected</span>
                <span class="block text-sm font-bold text-neutral-900" [title]="idea.rejectionReasonCategory">{{ idea.rejectionReasonCategory || 'Yes' }}</span>
              </div>
              <div *ngIf="idea.previouslyRejected && idea.whatChangedAfterRejection" class="sm:col-span-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-neutral-200">
                <span class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">What changed</span>
                <span class="block text-sm italic text-neutral-700">{{ idea.whatChangedAfterRejection }}</span>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-6 mt-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-bold text-neutral-900">Interest Actions</h4>
                <a [routerLink]="['/idea', idea.id]" class="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center group">
                  Full Prospectus <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <app-button 
                  (onClick)="expressInterest(idea.id, 'HighlyInterested')" 
                  [variant]="getInterestStatus(idea.id) === 'HighlyInterested' ? 'primary' : 'outline'"
                  [fullWidth]="true">
                  <span class="mr-2">🔥</span> Highly Interested
                </app-button>
                <app-button 
                  (onClick)="expressInterest(idea.id, 'Maybe')" 
                  [variant]="getInterestStatus(idea.id) === 'Maybe' ? 'secondary' : 'outline'"
                  [fullWidth]="true">
                  <span class="mr-2">🤔</span> Keep in Touch
                </app-button>
                <app-button 
                  (onClick)="expressInterest(idea.id, 'Pass')" 
                  [variant]="getInterestStatus(idea.id) === 'Pass' ? 'danger' : 'outline'"
                  [fullWidth]="true">
                  <span class="mr-2">❌</span> Pass
                </app-button>
              </div>
            </div>
        </app-card>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="!isLoading() && totalCount() > pageSize" class="mt-8 max-w-4xl mx-auto">
        <app-card padding="sm">
            <div class="flex justify-between items-center px-2">
                <app-button variant="ghost" size="sm" [disabled]="currentPage() === 1" (onClick)="loadIdeas(currentPage() - 1)">
                  Previous
                </app-button>
                <span class="text-sm font-medium text-neutral-500">
                  Page <span class="text-neutral-900 font-bold">{{ currentPage() }}</span> of <span class="text-neutral-900 font-bold">{{ Math.ceil(totalCount() / pageSize) }}</span>
                </span>
                <app-button variant="ghost" size="sm" [disabled]="currentPage() * pageSize >= totalCount()" (onClick)="loadIdeas(currentPage() + 1)">
                  Next
                </app-button>
            </div>
        </app-card>
      </div>
    </div>
  `
})
export class BrowseIdeasComponent implements OnInit {
  private ideaService = inject(IdeaService);
  private interestService = inject(InterestService);
  private watchlistService = inject(WatchlistService);
  private cdr = inject(ChangeDetectorRef);

  Math = Math;

  // Use Signals for zoneless change detection
  ideas = signal<Idea[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  totalCount = signal(0);
  myInterests = signal<{ [ideaId: string]: 'Interested' | 'HighlyInterested' | 'Maybe' | 'Pass' }>({});
  myWatchlist = signal<Set<string>>(new Set());

  pageSize = 10;

  filters = {
    stage: '',
    industry: '',
    previouslyRejected: '' as unknown as boolean | undefined,
    location: '',
    keyword: ''
  };

  ngOnInit() {
    this.loadIdeas(1);
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.watchlistService.getMyWatchlist().subscribe({
      next: (data) => {
        this.myWatchlist.set(new Set(data.map(w => w.ideaId)));
        this.cdr.markForCheck();
      }
    });
  }

  loadIdeas(page: number) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    let rejectedParam: boolean | undefined = undefined;
    if (this.filters.previouslyRejected === true || (this.filters.previouslyRejected as any) === 'true') rejectedParam = true;
    if (this.filters.previouslyRejected === false || (this.filters.previouslyRejected as any) === 'false') rejectedParam = false;

    this.ideaService.getIdeas(
      this.filters.stage || undefined,
      this.filters.industry || undefined,
      rejectedParam,
      (this.filters as any).location || undefined,
      (this.filters as any).keyword || undefined,
      page,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.ideas.set(res.items);
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  resetFilters() {
    this.filters = { stage: '', industry: '', previouslyRejected: '' as any, location: '', keyword: '' };
    this.loadIdeas(1);
  }

  expressInterest(ideaId: string, status: 'Interested' | 'HighlyInterested' | 'Maybe' | 'Pass') {
    // Instant UI feedback
    this.myInterests.update(prev => ({ ...prev, [ideaId]: status }));
    this.cdr.markForCheck();

    this.interestService.expressInterest(ideaId, { status }).subscribe({
      error: () => {
        // Revert on error
        this.myInterests.update(prev => {
          const copy = { ...prev };
          delete copy[ideaId];
          return copy;
        });
        this.cdr.markForCheck();
        alert('Failed to save interest. Please try again.');
      }
    });
  }

  getInterestStatus(ideaId: string) {
    return this.myInterests()[ideaId];
  }

  isWatchlisted(ideaId: string): boolean {
    return this.myWatchlist().has(ideaId);
  }

  toggleWatchlist(ideaId: string) {
    const isW = this.isWatchlisted(ideaId);

    // Optimistic toggle
    const current = new Set(this.myWatchlist());
    if (isW) {
      current.delete(ideaId);
    } else {
      current.add(ideaId);
    }
    this.myWatchlist.set(current);
    this.cdr.markForCheck();

    if (isW) {
      this.watchlistService.removeFromWatchlist(ideaId).subscribe({
        error: () => this.revertWatchlistChange(ideaId, true)
      });
    } else {
      this.watchlistService.addToWatchlist({ ideaId }).subscribe({
        error: () => this.revertWatchlistChange(ideaId, false)
      });
    }
  }

  private revertWatchlistChange(ideaId: string, shouldBeWatchlisted: boolean) {
    const current = new Set(this.myWatchlist());
    if (shouldBeWatchlisted) current.add(ideaId);
    else current.delete(ideaId);
    this.myWatchlist.set(current);
    this.cdr.markForCheck();
  }
}
