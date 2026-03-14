import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-score-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="inline-flex flex-col items-center">
      <div [class]="getScoreColor(score)" 
           class="relative group cursor-help p-1 rounded-full border-2 transition-all duration-300 hover:scale-110">
        <!-- Radial Progress Circle -->
        <svg class="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent"
                  stroke-dasharray="175" [attr.stroke-dashoffset]="175 - (score / 100 * 175)"
                  class="opacity-100 transition-all duration-1000 ease-out" />
          <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent"
                  class="opacity-20" />
        </svg>
        
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold">{{ score }}%</span>
        </div>

        <!-- Tooltip -->
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border border-gray-700">
          <div class="font-bold mb-2 text-indigo-400">Match Reasons:</div>
          <ul class="space-y-1 list-disc pl-3">
            <li *ngFor="let reason of reasons">{{ reason }}</li>
          </ul>
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
        </div>
      </div>
      <span class="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Compatibility</span>
    </div>
  `,
    styles: [`
    :host { display: inline-block; }
  `]
})
export class MatchScoreBadgeComponent {
    @Input() score: number = 0;
    @Input() reasons: string[] = [];

    getScoreColor(score: number): string {
        if (score >= 80) return 'text-primary-500 border-primary-500/30';
        if (score >= 50) return 'text-accent border-accent/30';
        return 'text-rose-400 border-rose-500/30';
    }
}
