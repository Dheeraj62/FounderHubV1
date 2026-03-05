import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { InterestService } from '../../core/services/interest.service';
import { Idea } from '../../core/models/idea.models';

@Component({
  selector: 'app-browse-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="app-page">
      <div class="app-page-header">
        <div>
          <h1 class="app-page-title">Discover Ideas</h1>
          <p class="app-page-subtitle">Find the next big thing and connect with visionary founders.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Stage</label>
            <select [(ngModel)]="filters.stage" (change)="loadIdeas(1)" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="">All Stages</option>
              <option value="Idea">Idea Only</option>
              <option value="MVP">MVP Built</option>
              <option value="EarlyRevenue">Early Revenue</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Industry</label>
            <select [(ngModel)]="filters.industry" (change)="loadIdeas(1)" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Previously Rejected?</label>
            <select [(ngModel)]="filters.previouslyRejected" (change)="loadIdeas(1)" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="">Any</option>
              <option [ngValue]="true">Yes</option>
              <option [ngValue]="false">No</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" class="w-full bg-gray-100 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!isLoading() && ideas().length === 0" class="text-center py-20 text-gray-500">
        No ideas found matching your criteria.
      </div>

      <div *ngIf="!isLoading() && ideas().length > 0" class="space-y-6">
        <div *ngFor="let idea of ideas()" class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition">
          <div class="p-6 md:p-8">
            <div class="flex items-center justify-between mb-2">
              <div class="flex space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{{ idea.industry }}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{{ idea.stage }}</span>
              </div>
              <span class="text-xs text-gray-500">Posted {{ idea.createdAt | date:'mediumDate' }}</span>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ idea.title }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">The Problem</h4>
                <p class="text-gray-600 text-sm whitespace-pre-line">{{ idea.problem }}</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">The Solution</h4>
                <p class="text-gray-600 text-sm whitespace-pre-line">{{ idea.solution }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
              <div *ngIf="idea.fundingRange">
                <span class="block text-xs font-semibold text-gray-500 uppercase">Target Funding</span>
                <span class="block text-sm font-medium text-gray-900 mt-1">{{ idea.fundingRange }}</span>
              </div>
              <div *ngIf="idea.previouslyRejected">
                <span class="block text-xs font-semibold text-red-500 uppercase">Previously Rejected</span>
                <span class="block text-sm font-medium text-gray-900 mt-1" [title]="idea.rejectionReasonCategory">{{ idea.rejectionReasonCategory || 'Yes' }}</span>
              </div>
              <div *ngIf="idea.previouslyRejected && idea.whatChangedAfterRejection" class="md:col-span-3 mt-2 md:mt-0">
                <span class="block text-xs font-semibold text-gray-500 uppercase">What changed</span>
                <span class="block text-sm italic text-gray-700 mt-1">{{ idea.whatChangedAfterRejection }}</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-semibold text-gray-900">Next Steps</h4>
                <a [routerLink]="['/idea', idea.id]" class="text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center">
                  View Full Details <span class="ml-1">→</span>
                </a>
              </div>
              <div class="flex space-x-4">
                <button (click)="expressInterest(idea.id, 'HighlyInterested')" 
                  [class]="getInterestStatus(idea.id) === 'HighlyInterested' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="flex-1 py-2 px-4 border shadow-sm text-sm font-medium rounded-md transition duration-150">
                  🔥 Highly Interested
                </button>
                <button (click)="expressInterest(idea.id, 'Maybe')" 
                  [class]="getInterestStatus(idea.id) === 'Maybe' ? 'bg-yellow-500 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="flex-1 py-2 px-4 border shadow-sm text-sm font-medium rounded-md transition duration-150">
                  🤔 Keep in Touch
                </button>
                <button (click)="expressInterest(idea.id, 'Pass')" 
                  [class]="getInterestStatus(idea.id) === 'Pass' ? 'bg-red-500 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="flex-1 py-2 px-4 border shadow-sm text-sm font-medium rounded-md transition duration-150">
                  ❌ Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="!isLoading() && totalCount() > pageSize" class="mt-8 flex justify-between items-center bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
        <button [disabled]="currentPage() === 1" (click)="loadIdeas(currentPage() - 1)" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <span class="text-sm text-gray-700">
          Page <span class="font-medium">{{ currentPage() }}</span> of <span class="font-medium">{{ Math.ceil(totalCount() / pageSize) }}</span>
        </span>
        <button [disabled]="currentPage() * pageSize >= totalCount()" (click)="loadIdeas(currentPage() + 1)" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  `
})
export class BrowseIdeasComponent implements OnInit {
  private ideaService = inject(IdeaService);
  private interestService = inject(InterestService);
  private cdr = inject(ChangeDetectorRef);

  Math = Math;

  // Use Signals for zoneless change detection
  ideas = signal<Idea[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  totalCount = signal(0);
  myInterests = signal<{ [ideaId: string]: 'Interested' | 'HighlyInterested' | 'Maybe' | 'Pass' }>({});

  pageSize = 10;

  filters = {
    stage: '',
    industry: '',
    previouslyRejected: '' as unknown as boolean | undefined
  };

  ngOnInit() {
    this.loadIdeas(1);
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
    this.filters = { stage: '', industry: '', previouslyRejected: '' as any };
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
}
