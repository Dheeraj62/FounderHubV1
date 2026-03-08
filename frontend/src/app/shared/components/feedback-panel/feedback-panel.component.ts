import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService, FeedbackDto, SubmitFeedbackRequest } from '../../../core/services/feedback.service';
import { AuthService } from '../../../core/services/auth.service';
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
          <h3 class="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>💬</span> Submit Feedback
          </h3>

          <div class="space-y-5">
            <!-- Rating rows -->
            <div *ngFor="let cat of ratingCategories" class="flex items-center justify-between gap-4">
              <span class="text-sm font-medium text-gray-400 w-40 shrink-0">{{ cat.label }}</span>
              <div class="flex gap-1.5">
                <button *ngFor="let star of [1,2,3,4,5]"
                  (click)="setRating(cat.key, star)"
                  [class]="form[cat.key] >= star ? 'text-yellow-400' : 'text-gray-600'"
                  class="text-2xl hover:scale-110 transition-transform leading-none">
                  ★
                </button>
              </div>
            </div>

            <!-- Text areas -->
            <textarea [(ngModel)]="form.strengths" placeholder="What are its strengths?" rows="2"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 transition-all"></textarea>
            <textarea [(ngModel)]="form.improvements" placeholder="What could be improved?" rows="2"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 transition-all"></textarea>
            <textarea [(ngModel)]="form.comments" placeholder="Any additional comments..." rows="2"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 transition-all"></textarea>
          </div>

          <div class="mt-5 flex justify-end">
            <app-button variant="primary" (onClick)="submitFeedback()" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Submitting...' : 'Submit Feedback' }}
            </app-button>
          </div>
        </app-card>
      </div>
      
      <div *ngIf="isInvestor && hasSubmitted()" class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-medium text-center">
        ✅ Thank you! Your feedback has been submitted.
      </div>

      <!-- Founder: View feedback panel -->
      <div *ngIf="isFounderOfIdea">
        <h3 class="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>📊</span> Investor Feedback ({{ feedbacks().length }})
        </h3>

        <div *ngIf="isLoading()" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
        </div>

        <div *ngIf="!isLoading() && feedbacks().length === 0" class="text-center text-gray-500 py-8">
          No investor feedback yet.
        </div>

        <div class="space-y-4" *ngIf="!isLoading() && feedbacks().length > 0">
          <app-card *ngFor="let f of feedbacks()">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-sm font-bold text-gray-200">{{ f.investorName }}</p>
                <p class="text-xs text-gray-500">{{ f.createdAt | date:'mediumDate' }}</p>
              </div>
              <div class="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                {{ f.overallRating }}<span class="text-yellow-400">★</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <div *ngFor="let cat of ratingCategories" class="flex items-center justify-between text-xs">
                <span class="text-gray-500">{{ cat.label }}</span>
                <span class="text-yellow-400 font-bold">{{ getFeedbackScore(f, cat.key) }}★</span>
              </div>
            </div>

            <div *ngIf="f.strengths" class="mt-3 text-xs p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span class="font-bold text-emerald-400">💪 Strengths: </span>
              <span class="text-gray-300">{{ f.strengths }}</span>
            </div>
            <div *ngIf="f.improvements" class="mt-2 text-xs p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <span class="font-bold text-amber-400">🔧 Improve: </span>
              <span class="text-gray-300">{{ f.improvements }}</span>
            </div>
            <div *ngIf="f.comments" class="mt-2 text-xs text-gray-400 italic">"{{ f.comments }}"</div>
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
            error: () => {
                this.isSubmitting.set(false);
                alert('Failed to submit feedback.');
                this.cdr.markForCheck();
            }
        });
    }
}
