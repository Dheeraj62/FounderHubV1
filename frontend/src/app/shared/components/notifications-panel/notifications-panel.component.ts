import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.models';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Updates</h1>
          <p class="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-1">Stay informed on your ecosystem events</p>
        </div>
        <button (click)="markAll()" class="text-xs font-black text-primary-600 hover:text-primary-800 uppercase tracking-[0.2em] border-b border-primary-600/30 transition-colors">
          Mark all as read
        </button>
      </div>

      <div class="space-y-4" *ngIf="notifications.length > 0">
        <div *ngFor="let note of notifications" 
             [class.opacity-50]="note.isRead"
             class="flex items-start gap-4 p-4 rounded-lg border bg-white hover:bg-neutral-50 transition-colors group">
          
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-primary-50 border border-primary-100 text-primary-700 transition-colors">
            {{ getIcon(note.type) }}
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-neutral-900 font-bold leading-tight">{{ note.title }}</h3>
              <span class="text-[9px] text-neutral-500 uppercase font-black">{{ note.createdAt | date:'shortTime' }}</span>
            </div>
            <p class="text-sm text-neutral-600 leading-relaxed">{{ note.body }}</p>
            
            <button *ngIf="!note.isRead" (click)="mark(note.id)" 
                    class="mt-3 text-[10px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest transition-colors">
              Mark Read
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="notifications.length === 0" class="text-center py-24 bg-neutral-50 rounded-3xl border border-dashed border-neutral-300">
        <div class="text-5xl mb-4 text-neutral-300">🔔</div>
        <p class="text-neutral-500 font-bold uppercase tracking-widest text-xs">All caught up! No new activity.</p>
      </div>
    </div>
  `,
  styles: []
})
export class NotificationsPanelComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getMyNotifications().subscribe(list => {
      this.notifications = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.cdr.markForCheck();
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'ConnectionRequest': return '🤝';
      case 'ConnectionAccepted': return '🔥';
      case 'NewInterest': return '🎯';
      case 'NewMessage': return '💬';
      default: return '📢';
    }
  }

  mark(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => this.loadNotifications());
  }

  markAll() {
    this.notificationService.markAllAsRead().subscribe(() => this.loadNotifications());
  }
}
