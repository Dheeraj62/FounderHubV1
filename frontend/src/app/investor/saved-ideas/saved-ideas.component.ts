import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SavedIdeaService } from '../../core/services/saved-idea.service';
import { Idea } from '../../core/models/idea.models';

@Component({
    selector: 'app-saved-ideas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-7xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-black text-white mb-2 flex items-center tracking-tight">
        <span class="mr-3">⭐</span> Bookmarked Ideas
      </h1>
      <p class="text-gray-500 mb-10 font-bold uppercase tracking-widest text-xs">Curated list of interesting ventures</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="ideas.length > 0">
        <div *ngFor="let idea of ideas" 
             class="group bg-gray-900 border border-gray-800 rounded-3xl p-8 transition-all hover:bg-gray-800/10 hover:-translate-y-2 relative">
          
          <button (click)="unsave(idea.id)" 
                  class="absolute top-6 right-6 text-rose-500 p-2 bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
            ✕
          </button>

          <div class="mb-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full">
              {{ idea.industry }}
            </span>
          </div>

          <h2 class="text-2xl font-bold text-white mb-2 line-clamp-1 leading-tight">{{ idea.title }}</h2>
          <p class="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed">{{ idea.problem }}</p>

          <div class="pt-6 border-t border-gray-800 flex justify-between items-center">
            <span class="text-emerald-400 font-bold text-sm tracking-tighter">{{ idea.fundingRange || 'Flexible' }}</span>
            <a [routerLink]="['/idea', idea.id]" 
               class="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-6 rounded-2xl text-[10px] uppercase tracking-wider transition-all shadow-xl shadow-indigo-500/10">
              Open Pitch
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="ideas.length === 0" class="text-center py-24 bg-gray-900/30 rounded-3xl border border-gray-800">
        <p class="text-gray-500">Your bookmarks gallery is currently empty.</p>
      </div>
    </div>
  `,
    styles: []
})
export class SavedIdeasComponent implements OnInit {
    ideas: Idea[] = [];

    constructor(private savedIdeaService: SavedIdeaService) { }

    ngOnInit(): void {
        this.loadSavedIdeas();
    }

    loadSavedIdeas() {
        this.savedIdeaService.getSavedIdeas().subscribe(list => {
            this.ideas = list;
        });
    }

    unsave(id: string) {
        this.savedIdeaService.unsaveIdea(id).subscribe(() => this.loadSavedIdeas());
    }
}
