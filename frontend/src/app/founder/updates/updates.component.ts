import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FounderUpdatesService, FounderUpdate } from '../../core/services/founder-updates.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
    selector: 'app-updates',
    standalone: true,
    imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
    template: `
    <div class="max-w-3xl mx-auto space-y-4">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-h1">Startup Updates</h1>
        <p class="text-body mt-1">Share milestones and progress with your network.</p>
      </div>

      <!-- Post Update Card -->
      <app-card>
        <h2 class="text-base font-bold text-neutral-800 mb-4">Post a New Update</h2>
        <textarea
          [(ngModel)]="newContent"
          placeholder="Share a milestone, pivot, new partnership, or traction win..."
          rows="4"
          class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 resize-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
        ></textarea>
        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-neutral-400">{{ newContent.length }}/500 characters</span>
          <app-button variant="primary" (onClick)="postUpdate()" [disabled]="!newContent.trim() || isPosting()">
            {{ isPosting() ? 'Posting...' : '📢 Post Update' }}
          </app-button>
        </div>
      </app-card>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Timeline Feed -->
      <div class="space-y-4" *ngIf="!isLoading()">
        <div *ngIf="updates().length === 0" class="flex flex-col items-center py-16 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center">
          <span class="text-5xl mb-4">🚀</span>
          <p class="text-neutral-600 font-semibold">No updates yet.</p>
          <p class="text-neutral-400 text-sm mt-1">Post your first startup update above.</p>
        </div>

        <div *ngFor="let update of updates()" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black text-sm shrink-0">
              📢
            </div>
            <div class="flex-1 w-px bg-neutral-200 mt-2"></div>
          </div>
          <app-card class="flex-1 mb-4">
            <p class="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{{ update.content }}</p>
            <p class="text-xs text-neutral-400 mt-3 font-medium">{{ update.createdAt | date:'medium' }}</p>
          </app-card>
        </div>
      </div>

    </div>
  `
})
export class UpdatesComponent implements OnInit {
    private updatesService = inject(FounderUpdatesService);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    updates = signal<FounderUpdate[]>([]);
    isLoading = signal(true);
    isPosting = signal(false);
    newContent = '';

    ngOnInit() {
        const founderId = this.authService.getUserId();
        if (founderId) {
            this.updatesService.getByFounder(founderId).subscribe({
                next: (data) => {
                    this.updates.set(data);
                    this.isLoading.set(false);
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.isLoading.set(false);
                    this.cdr.markForCheck();
                }
            });
        } else {
            this.isLoading.set(false);
        }
    }

    postUpdate() {
        const content = this.newContent.trim();
        if (!content) return;
        this.isPosting.set(true);

        this.updatesService.create(content).subscribe({
            next: (newUpdate) => {
                this.updates.update(list => [newUpdate, ...list]);
                this.newContent = '';
                this.isPosting.set(false);
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.isPosting.set(false);
                this.toastService.error('Failed to post update. Please try again.');
                this.cdr.markForCheck();
            }
        });
    }
}
