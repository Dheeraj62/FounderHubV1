import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { RecommendedIdea } from '../../core/models/idea.models';
import { MatchScoreBadgeComponent } from '../../shared/components/match-score-badge/match-score-badge.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, MatchScoreBadgeComponent],
  template: `
    <div class="max-w-7xl mx-auto py-12 px-4 shadow-sm border border-neutral-100 rounded-2xl bg-white mt-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black text-neutral-900 tracking-tighter">Smart <span class="text-primary-600">Matches</span></h1>
          <p class="text-neutral-500 text-xl mt-3 max-w-2xl">Personalized startup opportunities based on your investment thesis.</p>
        </div>
        <div class="flex flex-wrap gap-4">
          <a routerLink="/investor/profile" class="text-primary-600 font-semibold flex items-center bg-white border border-neutral-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
            ⚙️ Preferences
          </a>
          <button (click)="loadMatches()" class="text-neutral-600 font-semibold hover:text-primary-600 transition-all flex items-center bg-white border border-neutral-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:border-primary-200">
            <span class="mr-2">↻</span> Refresh
          </button>
          <a routerLink="/investor/browse" class="text-white font-semibold flex items-center bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg shadow-sm shadow-primary-500/20 hover:shadow-md transition-all">
            See All Ideas →
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="h-80 bg-white border border-neutral-100 rounded-xl animate-pulse shadow-sm"></div>
      </div>

      <div *ngIf="!loading && ideas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let idea of ideas" 
             class="group bg-white rounded-xl shadow-sm p-6 hover:shadow-premium transition-all border border-neutral-200 hover:border-primary-100 relative overflow-hidden flex flex-col justify-between">
          
          <div>
            <div class="flex justify-between items-start mb-4">
              <app-match-score-badge [score]="idea.matchScore" [reasons]="idea.matchReasons"></app-match-score-badge>
              <span class="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">{{ idea.stage }}</span>
            </div>

            <h2 class="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 leading-tight group-hover:text-primary-600 transition-colors">{{ idea.title }}</h2>
            <div class="flex items-center gap-2 mb-4">
               <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 bg-neutral-50 px-2 py-0.5 rounded-full">{{ idea.industry }}</span>
            </div>
            
            <p class="text-neutral-600 text-sm line-clamp-3 mb-4 leading-relaxed">{{ idea.problem }}</p>

            <div class="mb-4">
              <h4 class="text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-wider">Match Reasons</h4>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let reason of idea.matchReasons" class="bg-primary-50 text-primary-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-primary-100 flex items-center">
                  <span class="mr-1 text-primary-500">✓</span> {{ reason }}
                </span>
                <span *ngIf="!idea.matchReasons || idea.matchReasons.length === 0" class="text-neutral-400 text-xs italic">
                  Matched via standard activity
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-100 flex justify-between items-center mt-auto group-hover:border-primary-100 transition-colors">
            <div>
              <p class="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-0.5">Funding Ask</p>
              <span class="text-neutral-900 font-bold text-sm">{{ idea.fundingRange || 'Flexible' }}</span>
            </div>
            <a [routerLink]="['/idea', idea.id]" 
               class="bg-white text-primary-600 border border-primary-200 font-bold py-2 px-4 rounded-lg text-xs hover:bg-primary-600 hover:text-white transition-all shadow-sm">
              Explore Idea
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && ideas.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 shadow-sm">
        <div class="text-5xl mb-4">🔍</div>
        <h2 class="text-xl font-bold text-neutral-800">No matching startups right now</h2>
        <p class="text-neutral-500 mt-2 max-w-md mx-auto">Try adjusting your preferences to see more opportunities tailored to your investment thesis.</p>
        <button routerLink="/investor/profile" class="mt-6 text-primary-600 font-bold underline hover:text-primary-700 transition-colors">Update Preferences</button>
      </div>
    </div>
  `,
  styles: []
})
export class RecommendationsComponent implements OnInit {
  ideas: RecommendedIdea[] = [];
  loading = true;

  constructor(private ideaService: IdeaService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.ideaService.getSmartMatches(1, 20).subscribe({
      next: (list) => {
        console.log('Smart Matches received:', list);
        this.ideas = list;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading smart matches:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
