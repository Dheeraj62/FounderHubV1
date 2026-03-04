import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { RecommendedIdea } from '../../core/models/idea.models';
import { MatchScoreBadgeComponent } from '../../shared/components/match-score-badge/match-score-badge.component';

@Component({
    selector: 'app-recommendations',
    standalone: true,
    imports: [CommonModule, RouterModule, MatchScoreBadgeComponent],
    template: `
    <div class="max-w-7xl mx-auto py-12 px-4">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black text-white tracking-tighter">AI-Driven <span class="text-indigo-500">Matches</span></h1>
          <p class="text-gray-400 text-xl mt-3 max-w-2xl">Hyper-relevant startups calculated based on your investment thesis, target stage, and location.</p>
        </div>
        <a routerLink="/investor/browse" class="text-indigo-400 font-bold hover:text-indigo-300 transition-all flex items-center group">
          Explore All Ideas <span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
        </a>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let i of [1,2,3]" class="h-80 bg-gray-900 border border-gray-800 rounded-3xl animate-pulse"></div>
      </div>

      <div *ngIf="!loading && ideas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let idea of ideas" 
             class="group bg-gray-900 border border-gray-800 rounded-[32px] p-8 transition-all hover:bg-gray-800/10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          <!-- Background Glow -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-2xl transition-all"></div>

          <div class="flex justify-between items-start mb-8">
            <app-match-score-badge [score]="idea.matchScore" [reasons]="idea.matchReasons"></app-match-score-badge>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">{{ idea.industry }}</span>
          </div>

          <h2 class="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight">{{ idea.title }}</h2>
          <p class="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed">{{ idea.problem }}</p>

          <div class="pt-6 border-t border-gray-800 flex justify-between items-center">
            <span class="text-emerald-400 font-bold text-sm">{{ idea.fundingRange || 'Flexible' }}</span>
            <a [routerLink]="['/idea', idea.id]" 
               class="bg-white text-black font-black py-2.5 px-6 rounded-2xl text-xs uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all">
              View Pitch
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && ideas.length === 0" class="text-center py-24 bg-gray-900/50 rounded-[40px] border border-dashed border-gray-800">
        <div class="text-6xl mb-6">🔭</div>
        <h2 class="text-2xl font-bold text-white">No perfect matches yet</h2>
        <p class="text-gray-500 mt-2">Try broadening your investment criteria in your profile.</p>
        <button routerLink="/investor/profile" class="mt-8 text-indigo-400 font-bold underline">Update Preferences</button>
      </div>
    </div>
  `,
    styles: []
})
export class RecommendationsComponent implements OnInit {
    ideas: RecommendedIdea[] = [];
    loading = true;

    constructor(private ideaService: IdeaService) { }

    ngOnInit(): void {
        this.ideaService.getRecommended().subscribe({
            next: (list) => {
                this.ideas = list;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
