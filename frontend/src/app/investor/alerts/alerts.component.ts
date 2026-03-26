import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertService, Alert } from '../../core/services/alert.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-investor-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <div class="h-full flex flex-col p-4 sm:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Alerts</h1>
          <p class="text-neutral-500 font-medium mt-1">
            Stay on top of matching startups and portfolio updates.
          </p>
        </div>
        <app-button variant="ghost" size="sm" (onClick)="markAllRead()" *ngIf="unreadCount() > 0">
          Mark all read ({{ unreadCount() }})
        </app-button>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty -->
      <div *ngIf="!isLoading() && alerts().length === 0"
           class="flex-1 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50">
        <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-4">🔔</div>
        <h3 class="text-xl font-bold text-neutral-900 mb-2">You're all caught up!</h3>
        <p class="text-neutral-500 max-w-sm">When new startups match your thesis or portfolio items are updated, you'll see them here.</p>
      </div>

      <!-- Alerts List -->
      <div *ngIf="!isLoading() && alerts().length > 0" class="space-y-3">
        <div
          *ngFor="let alert of alerts()"
          class="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md"
          [ngClass]="alert.isRead ? 'bg-white border-neutral-100' : 'bg-primary-50/50 border-primary-200'"
          (click)="onAlertClick(alert)"
        >
          <!-- Type Icon -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
               [ngClass]="getIconBg(alert.alertType)">
            {{ getIcon(alert.alertType) }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="font-bold text-sm text-neutral-900">{{ alert.title }}</p>
              <span class="text-xs text-neutral-400 whitespace-nowrap shrink-0">{{ alert.createdAt | date:'MMM d' }}</span>
            </div>
            <p class="text-sm text-neutral-600 mt-0.5 leading-relaxed">{{ alert.message }}</p>
          </div>

          <!-- Unread dot -->
          <div *ngIf="!alert.isRead" class="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0"></div>
        </div>
      </div>
    </div>
  `
})
export class InvestorAlertsComponent implements OnInit {
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  alerts = signal<Alert[]>([]);
  isLoading = signal(true);
  unreadCount = signal(0);

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts.set(data);
        this.unreadCount.set(data.filter(a => !a.isRead).length);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onAlertClick(alert: Alert) {
    if (!alert.isRead) {
      this.alertService.markRead(alert.id).subscribe();
      this.alerts.update(list => list.map(a => a.id === alert.id ? { ...a, isRead: true } : a));
      this.unreadCount.update(c => Math.max(0, c - 1));
      this.cdr.markForCheck();
    }
  }

  markAllRead() {
    this.alertService.markAllRead().subscribe({
      next: () => {
        this.alerts.update(list => list.map(a => ({ ...a, isRead: true })));
        this.unreadCount.set(0);
        this.toastService.success('All alerts marked as read.');
        this.cdr.markForCheck();
      }
    });
  }

  getIcon(alertType: string): string {
    const icons: Record<string, string> = {
      NewMatch: '🎯', TractionSpike: '🚀', IdeaUpdated: '✏️', NewMessage: '💬'
    };
    return icons[alertType] ?? '🔔';
  }

  getIconBg(alertType: string): string {
    const bgs: Record<string, string> = {
      NewMatch: 'bg-primary-100', TractionSpike: 'bg-green-100', IdeaUpdated: 'bg-amber-100', NewMessage: 'bg-blue-100'
    };
    return bgs[alertType] ?? 'bg-neutral-100';
  }
}
