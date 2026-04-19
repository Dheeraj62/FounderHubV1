import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { InterestService } from '../../core/services/interest.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
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
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Discover Ideas</h1>
          <p class="text-sm text-neutral-500 mt-1">Find the next big thing and connect with visionary founders.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest fill-neutral-400 mb-1.5">Stage</label>
            <select [(ngModel)]="filters.stage" (change)="loadIdeas(1)" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:bg-neutral-100 transition-all cursor-pointer">
              <option value="">All Stages</option>
              <option value="Idea">Idea Only</option>
              <option value="MVP">MVP Built</option>
              <option value="EarlyRevenue">Early Revenue</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Industry</label>
            <select [(ngModel)]="filters.industry" (change)="loadIdeas(1)" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:bg-neutral-100 transition-all cursor-pointer">
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
            <label class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Rejected?</label>
            <select [(ngModel)]="filters.previouslyRejected" (change)="loadIdeas(1)" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:bg-neutral-100 transition-all cursor-pointer">
              <option value="">Any</option>
              <option [ngValue]="true">Yes</option>
              <option [ngValue]="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Location</label>
            <input [(ngModel)]="filters.location" (input)="loadIdeas(1)" type="text" placeholder="e.g. SF, Remote"
              class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-neutral-400 transition-all" />
          </div>
          <div class="lg:col-span-1">
            <label class="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Keyword</label>
            <input [(ngModel)]="filters.keyword" (input)="loadIdeas(1)" type="text" placeholder="Search..."
              class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-neutral-400 transition-all" />
          </div>
          <div class="flex items-center">
            <button (click)="resetFilters()" class="w-full px-3 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 border border-transparent transition-colors">
              Clear
            </button>
          </div>
        </div>
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
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-h3">No ideas found</h3>
          <p class="text-body mt-2 max-w-sm mx-auto">Try adjusting your filters to see more startup concepts.</p>
        </app-card>
      </div>

      <!-- Content List -->
      <div *ngIf="!isLoading() && ideas().length > 0" class="space-y-5 max-w-4xl mx-auto">
        <div *ngFor="let idea of ideas()" class="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 sm:p-7 relative overflow-hidden group">
            
            <div class="flex items-start justify-between mb-2">
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">{{ idea.industry }}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase tracking-wider">{{ idea.stage }}</span>
                  <span *ngIf="idea.location" class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-neutral-50 text-neutral-500 border border-neutral-100 uppercase tracking-wider">
                    📍 {{ idea.location }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-primary-600 transition-colors cursor-pointer" [routerLink]="['/idea', idea.id]">
                  {{ idea.title }}
                </h3>
              </div>
              <div class="flex flex-col items-end gap-1">
                <button (click)="toggleWatchlist(idea.id); $event.stopPropagation()" 
                        [class]="isWatchlisted(idea.id) ? 'text-primary-500 bg-primary-50 hover:bg-primary-100' : 'text-neutral-300 hover:text-primary-500 hover:bg-neutral-50'"
                        class="p-2 rounded-xl transition-all border border-transparent hover:border-neutral-200 flex items-center justify-center -mr-2 -mt-2" 
                        title="Watchlist">
                  <svg class="w-5 h-5" [attr.fill]="isWatchlisted(idea.id) ? 'currentColor' : 'none'" [attr.stroke]="isWatchlisted(idea.id) ? 'none' : 'currentColor'" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <span class="text-[10px] sm:text-xs font-semibold text-neutral-400 whitespace-nowrap">{{ idea.createdAt | date:'MMM d, y' }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 mt-4">
              <div class="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 relative">
                <h4 class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> The Problem
                </h4>
                <p class="text-sm text-neutral-700 leading-relaxed font-medium">{{ idea.problem | slice:0:300 }}{{ idea.problem.length > 300 ? '...' : '' }}</p>
              </div>
              <div class="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 relative">
                <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> The Solution
                </h4>
                <p class="text-sm text-neutral-700 leading-relaxed font-medium">{{ idea.solution | slice:0:300 }}{{ idea.solution.length > 300 ? '...' : '' }}</p>
              </div>
            </div>

            <!-- Stats Flex Row (Replacing the bulky grid) -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div *ngIf="idea.fundingRange" class="inline-flex flex-col px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-sm">
                <span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Target Funding</span>
                <span class="text-xs font-bold text-neutral-900">{{ idea.fundingRange }}</span>
              </div>
              <div *ngIf="idea.previouslyRejected" class="inline-flex flex-col px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg shadow-sm">
                <span class="text-[9px] font-black text-rose-400 uppercase tracking-widest">Previously Rejected</span>
                <span class="text-xs font-bold text-rose-700" [title]="idea.rejectionReasonCategory">{{ idea.rejectionReasonCategory || 'Yes' }}</span>
              </div>
              <div *ngIf="idea.marketSize" class="inline-flex flex-col px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-sm">
                <span class="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Market Size</span>
                <span class="text-xs font-bold text-neutral-900 line-clamp-1 max-w-[150px]">{{ idea.marketSize }}</span>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  (click)="expressInterest(idea.id, 'HighlyInterested')" 
                  [class]="getInterestStatus(idea.id) === 'HighlyInterested' ? 'bg-indigo-600 text-white shadow-indigo-200 border-indigo-600' : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'"
                  class="flex-1 sm:flex-none border shadow-sm px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  🔥 Interested
                </button>
                <button 
                  (click)="expressInterest(idea.id, 'Maybe')" 
                  [class]="getInterestStatus(idea.id) === 'Maybe' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'"
                  class="flex-1 sm:flex-none border shadow-sm px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  🤔 Keep in Touch
                </button>
                <button 
                  (click)="expressInterest(idea.id, 'Pass')" 
                  [class]="getInterestStatus(idea.id) === 'Pass' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'"
                  class="flex-1 sm:flex-none border shadow-sm px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  ❌ Pass
                </button>
              </div>

              <a [routerLink]="['/idea', idea.id]" class="w-full sm:w-auto text-center sm:text-right text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest flex items-center justify-center sm:justify-end gap-1 group">
                Full Details <span class="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
        </div>
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
  private toastService = inject(ToastService);
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
        
        // Sync interest states from backend
        const interests: { [id: string]: any } = { ...this.myInterests() };
        res.items.forEach(idea => {
          if (idea.currentUserInterest) {
            interests[idea.id] = idea.currentUserInterest;
          }
        });
        this.myInterests.set(interests);

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
      error: (err) => {
        // Revert on error
        this.myInterests.update(prev => {
          const copy = { ...prev };
          delete copy[ideaId];
          return copy;
        });
        this.cdr.markForCheck();
        console.error('Interest error', err);
        this.toastService.error('Failed to save interest. Please try again.');
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
