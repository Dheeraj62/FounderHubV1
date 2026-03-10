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
    <div class="max-w-7xl mx-auto py-12 px-4">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black text-gray-900 tracking-tighter">Smart <span class="text-emerald-600">Matches</span></h1>
          <p class="text-gray-500 text-xl mt-3 max-w-2xl">Personalized startup opportunities based on your investment thesis.</p>
        </div>
        <div class="flex gap-4">
          <a routerLink="/investor/profile" class="text-emerald-600 font-semibold flex items-center bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
            ⚙️ Preferences
          </a>
          <button (click)="loadMatches()" class="text-gray-600 font-semibold hover:text-emerald-600 transition-all flex items-center bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md">
            <span class="mr-2">↻</span> Refresh
          </button>
          <a routerLink="/investor/browse" class="text-white font-semibold flex items-center bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
            See All Ideas →
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="h-80 bg-white border border-gray-100 rounded-xl animate-pulse shadow-sm"></div>
      </div>

      <div *ngIf="!loading && ideas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let idea of ideas" 
             class="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 relative overflow-hidden flex flex-col justify-between">
          
          <div>
            <div class="flex justify-between items-start mb-4">
              <app-match-score-badge [score]="idea.matchScore" [reasons]="idea.matchReasons"></app-match-score-badge>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{{ idea.stage }}</span>
            </div>

            <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1 leading-tight">{{ idea.title }}</h2>
            <div class="flex items-center gap-2 mb-4">
               <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">{{ idea.industry }}</span>
            </div>
            
            <p class="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{{ idea.problem }}</p>

            <div class="mb-4">
              <h4 class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Match Reasons</h4>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let reason of idea.matchReasons" class="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-emerald-100 flex items-center">
                  <span class="mr-1 text-emerald-500">✓</span> {{ reason }}
                </span>
                <span *ngIf="!idea.matchReasons || idea.matchReasons.length === 0" class="text-gray-400 text-xs italic">
                  Matched via standard activity
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Funding Ask</p>
              <span class="text-gray-900 font-bold text-sm">{{ idea.fundingRange || 'Flexible' }}</span>
            </div>
            <a [routerLink]="['/idea', idea.id]" 
               class="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold py-2 px-4 rounded-lg text-xs hover:bg-emerald-600 hover:text-white transition-all">
              Explore Idea
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && ideas.length === 0" class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="text-5xl mb-4">🔍</div>
        <h2 class="text-xl font-bold text-gray-800">No matching startups right now</h2>
        <p class="text-gray-500 mt-2">Try adjusting your preferences to see more opportunities.</p>
        <button routerLink="/investor/profile" class="mt-6 text-emerald-600 font-bold underline hover:text-emerald-700">Update Preferences</button>
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
