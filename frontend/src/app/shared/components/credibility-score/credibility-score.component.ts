import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredibilityService, CredibilityScore } from '../../../core/services/credibility.service';

@Component({
    selector: 'app-credibility-score',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="score()" class="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Credibility Score</h4>
        <span class="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider" [ngClass]="badgeClass()">{{ score()!.badge }}</span>
      </div>

      <!-- Score arc -->
      <div class="flex items-center gap-5 mt-2">
        <div class="relative w-20 h-20 shrink-0">
          <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#credGradient)" stroke-width="3"
              [attr.stroke-dasharray]="dashPercent() + ' 100'"
              stroke-linecap="round"/>
            <defs>
              <linearGradient id="credGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-black text-neutral-900">{{ score()!.score }}</span>
          </div>
        </div>
        <div class="text-[13px] space-y-2 text-neutral-500 flex-1 font-medium">
          <div class="flex justify-between items-center border-b border-neutral-200/50 pb-1">
            <span>Profile</span>
            <span class="text-neutral-800 font-bold">{{ score()!.profileScore }}/30</span>
          </div>
          <div class="flex justify-between items-center border-b border-neutral-200/50 pb-1">
            <span>Ideas</span>
            <span class="text-neutral-800 font-bold">{{ score()!.ideaScore }}/20</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Engagement</span>
            <span class="text-neutral-800 font-bold">{{ score()!.engagementScore }}/50</span>
          </div>
        </div>
      </div>
  `,
    styles: [`
    :host { display: block; }
  `]
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
        if (badge === 'Elite Founder') return 'bg-purple-100 text-purple-700 border border-purple-200';
        if (badge === 'Rising Star') return 'bg-primary-100 text-primary-700 border border-primary-200';
        if (badge === 'Promising') return 'bg-sky-100 text-sky-700 border border-sky-200';
        if (badge === 'Getting Started') return 'bg-amber-100 text-amber-700 border border-amber-200';
        return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    }
}
