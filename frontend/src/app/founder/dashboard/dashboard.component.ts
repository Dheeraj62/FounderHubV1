import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { Idea } from '../../core/models/idea.models';
import { InterestService } from '../../core/services/interest.service';

@Component({
  selector: 'app-founder-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">My Ideas</h1>
          <p class="mt-2 text-sm text-gray-500">Manage and track your startup concepts.</p>
        </div>
        <a routerLink="/founder/create-idea" class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5">
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Post New Idea
        </a>
      </div>

      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!isLoading() && ideas().length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No ideas yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by posting your first startup idea.</p>
        <div class="mt-6">
          <a routerLink="/founder/create-idea" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Post Idea
          </a>
        </div>
      </div>

      <div *ngIf="!isLoading() && ideas().length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let idea of ideas()" class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ idea.industry }}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {{ idea.stage }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-2 truncate" title="{{idea.title}}">{{ idea.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4 h-16">{{ idea.problem }}</p>
            
            <div class="border-t border-gray-100 pt-4 flex gap-4 text-sm text-gray-500">
              <div class="flex flex-col">
                <span class="text-xs uppercase tracking-wider font-semibold text-gray-400">Interested</span>
                <span class="font-medium text-indigo-600 text-lg">{{ getInterestCount(idea.id, 'interestedCount') }}</span>
              </div>
              <div class="flex flex-col ml-4">
                <span class="text-xs uppercase tracking-wider font-semibold text-gray-400">Maybe</span>
                <span class="font-medium text-gray-900 text-lg">{{ getInterestCount(idea.id, 'maybeCount') }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ idea.createdAt | date:'mediumDate' }}</span>
            <div class="space-x-3">
              <a [routerLink]="['/founder/edit-idea', idea.id]" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors">Edit</a>
              <button (click)="deleteIdea(idea.id)" class="text-red-600 hover:text-red-900 text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private ideaService = inject(IdeaService);
  private interestService = inject(InterestService);
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

  deleteIdea(id: string) {
    if (confirm('Are you sure you want to delete this idea?')) {
      this.ideaService.deleteIdea(id).subscribe({
        next: () => {
          this.ideas.update(prev => prev.filter(i => i.id !== id));
          this.cdr.markForCheck();
        }
      });
    }
  }
}
