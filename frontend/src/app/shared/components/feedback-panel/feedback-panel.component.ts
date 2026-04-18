import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService, FeedbackDto, SubmitFeedbackRequest } from '../../../core/services/feedback.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../ui/toast/toast.service';
import { CardComponent } from '../../ui/card/card.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
    selector: 'app-feedback-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
    template: `
    <div class="mt-8 space-y-6">
      <!-- Investor: Submit feedback form -->
      <div *ngIf="isInvestor && !hasSubmitted()">
        <app-card>
          <h3 class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-6 flex items-center gap-2">
            <span class="text-lg">💬</span> Submit Feedback
          </h3>

          <div class="space-y-5">
            <!-- Rating rows -->
            <div *ngFor="let cat of ratingCategories" class="flex items-center justify-between gap-4">
              <span class="text-sm font-bold text-neutral-600 w-40 shrink-0">{{ cat.label }}</span>
              <div class="flex gap-1.5">
                <button *ngFor="let star of [1,2,3,4,5]"
                  (click)="setRating(cat.key, star)"
                  [class]="form[cat.key] >= star ? 'text-amber-500' : 'text-neutral-200'"
                  class="text-2xl hover:scale-110 transition-transform leading-none">
                  ★
                </button>
              </div>
            </div>

            <!-- Text areas -->
            <textarea [(ngModel)]="form.strengths" placeholder="What are its strengths?" rows="2"
              class="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"></textarea>
            <textarea [(ngModel)]="form.improvements" placeholder="What could be improved?" rows="2"
              class="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"></textarea>
            <textarea [(ngModel)]="form.comments" placeholder="Any additional comments..." rows="2"
              class="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"></textarea>
          </div>

          <div class="mt-6 flex justify-end">
            <app-button variant="primary" (onClick)="submitFeedback()" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Submitting...' : 'Submit Feedback' }}
            </app-button>
          </div>
        </app-card>
      </div>
      
      <div *ngIf="isInvestor && hasSubmitted()" class="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold text-center shadow-sm">
        ✅ Thank you! Your feedback has been submitted.
      </div>

      <!-- Founder: View feedback panel -->
      <div *ngIf="isFounderOfIdea">
        <h3 class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
          <span class="text-lg">📊</span> Investor Feedback ({{ feedbacks().length }})
        </h3>

        <div *ngIf="isLoading()" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>

        <div *ngIf="!isLoading() && feedbacks().length === 0" class="text-center text-neutral-400 font-medium italic py-8 border border-neutral-100 rounded-[2rem] bg-neutral-50/50">
          No investor feedback yet.
        </div>

        <div class="space-y-5" *ngIf="!isLoading() && feedbacks().length > 0">
          <app-card *ngFor="let f of feedbacks()">
            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-[15px] font-bold text-neutral-900">{{ f.investorName }}</p>
                <p class="text-xs font-medium text-neutral-400">{{ f.createdAt | date:'mediumDate' }}</p>
              </div>
              <div class="flex items-center gap-1 font-black text-lg bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50 shadow-sm">
                {{ f.overallRating }}<span class="text-amber-500">★</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-5">
              <div *ngFor="let cat of ratingCategories" class="flex items-center justify-between text-xs bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100">
                <span class="text-neutral-500 font-semibold">{{ cat.label }}</span>
                <span class="text-amber-500 font-black">{{ getFeedbackScore(f, cat.key) }}★</span>
              </div>
            </div>

            <div *ngIf="f.strengths" class="mt-4 text-sm p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <span class="font-black text-emerald-600 block mb-1 text-[11px] uppercase tracking-widest">💪 Strengths</span>
              <span class="text-emerald-900 font-medium">{{ f.strengths }}</span>
            </div>
            <div *ngIf="f.improvements" class="mt-3 text-sm p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
              <span class="font-black text-amber-600 block mb-1 text-[11px] uppercase tracking-widest">🔧 Improve</span>
              <span class="text-amber-900 font-medium">{{ f.improvements }}</span>
            </div>
            <div *ngIf="f.comments" class="mt-4 text-sm text-neutral-600 font-medium italic border-l-4 border-neutral-200 pl-4 py-1">
              "{{ f.comments }}"
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class FeedbackPanelComponent implements OnInit {
    @Input({ required: true }) ideaId!: string;
    @Input() isInvestor = false;
    @Input() isFounderOfIdea = false;

    private feedbackService = inject(FeedbackService);
    private toastService = inject(ToastService);
    private auth = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    feedbacks = signal<FeedbackDto[]>([]);
    isLoading = signal(false);
    isSubmitting = signal(false);
    hasSubmitted = signal(false);

    ratingCategories = [
        { key: 'overallRating', label: 'Overall Rating' },
        { key: 'marketPotentialScore', label: 'Market Potential' },
        { key: 'teamScore', label: 'Team' },
        { key: 'tractionScore', label: 'Traction' },
        { key: 'uniqueValueScore', label: 'Unique Value Prop' },
    ];

    form: any = {
        overallRating: 0,
        marketPotentialScore: 0,
        teamScore: 0,
        tractionScore: 0,
        uniqueValueScore: 0,
        comments: '',
        strengths: '',
        improvements: ''
    };

    ngOnInit() {
        if (this.isFounderOfIdea) {
            this.loadFeedbacks();
        }
    }

    loadFeedbacks() {
        this.isLoading.set(true);
        this.feedbackService.getFeedbackForIdea(this.ideaId).subscribe({
            next: (data) => {
                this.feedbacks.set(data);
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    setRating(key: string, value: number) {
        this.form[key] = value;
    }

    getFeedbackScore(f: FeedbackDto, key: string): number {
        return (f as any)[key] ?? 0;
    }

    submitFeedback() {
        this.isSubmitting.set(true);
        const request: SubmitFeedbackRequest = {
            ideaId: this.ideaId,
            ...this.form
        };
        this.feedbackService.submitFeedback(request).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.hasSubmitted.set(true);
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.isSubmitting.set(false);
                this.toastService.error('Failed to submit feedback.');
                this.cdr.markForCheck();
            }
        });
    }
}
