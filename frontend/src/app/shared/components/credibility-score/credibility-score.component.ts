import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredibilityService, CredibilityScore } from '../../../core/services/credibility.service';

@Component({
    selector: 'app-credibility-score',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="score()" class="p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Credibility Score</h4>
        <span class="text-xs font-bold px-3 py-1 rounded-full" [ngClass]="badgeClass()">{{ score()!.badge }}</span>
      </div>

      <!-- Score arc -->
      <div class="flex items-center gap-4 mb-4">
        <div class="relative w-20 h-20 shrink-0">
          <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#credGradient)" stroke-width="3"
              [attr.stroke-dasharray]="dashPercent() + ' 100'"
              stroke-linecap="round"/>
            <defs>
              <linearGradient id="credGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-lg font-black text-white">{{ score()!.score }}</span>
          </div>
        </div>
        <div class="text-xs space-y-1 text-gray-400 flex-1">
          <div class="flex justify-between">
            <span>Profile</span>
            <span class="text-gray-200 font-bold">{{ score()!.profileScore }}/30</span>
          </div>
          <div class="flex justify-between">
            <span>Ideas</span>
            <span class="text-gray-200 font-bold">{{ score()!.ideaScore }}/20</span>
          </div>
          <div class="flex justify-between">
            <span>Engagement</span>
            <span class="text-gray-200 font-bold">{{ score()!.engagementScore }}/50</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CredibilityScoreComponent implements OnInit {
    @Input({ required: true }) founderId!: string;

    private credibilityService = inject(CredibilityService);
    private cdr = inject(ChangeDetectorRef);

    score = signal<CredibilityScore | null>(null);

    ngOnInit() {
        this.credibilityService.getScore(this.founderId).subscribe({
            next: (data) => {
                this.score.set(data);
                this.cdr.markForCheck();
            }
        });
    }

    dashPercent(): number {
        const s = this.score();
        if (!s) return 0;
        return Math.round((s.score / s.maxScore) * 100);
    }

    badgeClass(): string {
        const badge = this.score()?.badge ?? '';
        if (badge === 'Elite Founder') return 'bg-purple-500/20 text-purple-300';
        if (badge === 'Rising Star') return 'bg-indigo-500/20 text-indigo-300';
        if (badge === 'Promising') return 'bg-sky-500/20 text-sky-300';
        if (badge === 'Getting Started') return 'bg-amber-500/20 text-amber-300';
        return 'bg-gray-700 text-gray-400';
    }
}
