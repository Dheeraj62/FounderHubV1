import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaVersion } from '../../../core/models/version.models';
import { VersionService } from '../../../core/services/version.service';

@Component({
    selector: 'app-idea-timeline',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="timeline-container bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-2xl">
      <h3 class="text-xl font-bold mb-6 text-indigo-400 flex items-center">
        <span class="mr-2">🚀</span> Idea Evolution
      </h3>
      
      <div class="relative pl-8 border-l-2 border-indigo-500/30 space-y-8">
        <div *ngFor="let version of versions; let first = first" 
             class="transition-all duration-300 hover:scale-[1.01]">
          <!-- Node Dot -->
          <div class="absolute -left-[33px] w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-gray-900"></div>
          
          <div class="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 backdrop-blur-sm">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">
                Version {{ version.versionNumber }}
              </span>
              <span class="text-xs text-gray-500">{{ version.createdAt | date:'mediumDate' }}</span>
            </div>
            
            <div class="space-y-3">
              <div *ngIf="version.whatChanged" class="text-sm italic text-indigo-200 bg-indigo-500/5 p-2 rounded border-l-2 border-indigo-400">
                "{{ version.whatChanged }}"
              </div>
              
              <div>
                <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Problem</h4>
                <p class="text-sm text-gray-200">{{ version.problem }}</p>
              </div>
              
              <div>
                <h4 class="text-xs font-semibold text-gray-400 uppercase mb-1">Solution</h4>
                <p class="text-sm text-gray-200">{{ version.solution }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="versions.length === 0" class="text-center py-10 text-gray-500 italic">
        No evolution history available yet.
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
    .timeline-container {
      background: linear-gradient(145deg, #111827, #1f2937);
    }
  `]
})
export class IdeaTimelineComponent implements OnInit {
    @Input() ideaId!: string;
    versions: IdeaVersion[] = [];

    constructor(private versionService: VersionService) { }

    ngOnInit(): void {
        if (this.ideaId) {
            this.versionService.getVersions(this.ideaId).subscribe(v => {
                this.versions = v.sort((a, b) => b.versionNumber - a.versionNumber);
            });
        }
    }
}
