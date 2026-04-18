import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaVersion } from '../../../core/models/version.models';
import { VersionService } from '../../../core/services/version.service';

@Component({
    selector: 'app-idea-timeline',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="timeline-container bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm">
      <h3 class="text-xl font-bold mb-8 text-neutral-900 flex items-center tracking-tight">
        <span class="mr-3 text-2xl">🚀</span> Idea Evolution
      </h3>
      
      <div class="relative pl-8 border-l-2 border-primary-200 space-y-8">
        <div *ngFor="let version of versions; let first = first" 
             class="transition-all duration-300 hover:-translate-y-0.5">
          <!-- Node Dot -->
          <div class="absolute -left-[33px] w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white shadow-sm border border-primary-600"></div>
          
          <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 transition-shadow hover:shadow-md">
            <div class="flex justify-between items-start mb-4">
              <span class="text-[10px] font-bold uppercase tracking-widest text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">
                Version {{ version.versionNumber }}
              </span>
              <span class="text-xs font-medium text-neutral-400">{{ version.createdAt | date:'mediumDate' }}</span>
            </div>
            
            <div class="space-y-4">
              <div *ngIf="version.whatChanged" class="text-sm font-medium text-primary-700 bg-primary-50/50 p-3 rounded-xl border-l-4 border-primary-400">
                "{{ version.whatChanged }}"
              </div>
              
              <div>
                <h4 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Problem</h4>
                <p class="text-sm font-medium text-neutral-700">{{ version.problem }}</p>
              </div>
              
              <div>
                <h4 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Solution</h4>
                <p class="text-sm font-medium text-neutral-700">{{ version.solution }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="versions.length === 0" class="text-center py-12 text-neutral-400 font-medium italic">
        No evolution history available yet.
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
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
