import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.models';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tight">Updates</h1>
          <p class="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Stay informed on your ecosystem events</p>
        </div>
        <button (click)="markAll()" class="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] border-b border-indigo-400/30">
          Mark all as read
        </button>
      </div>

      <div class="space-y-4" *ngIf="notifications.length > 0">
        <div *ngFor="let note of notifications" 
             [class.opacity-50]="note.isRead"
             class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-5 transition-all hover:bg-gray-800/10 group">
          
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-gray-800 border border-gray-700 group-hover:border-indigo-500/30 transition-colors">
            {{ getIcon(note.type) }}
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-white font-bold leading-tight">{{ note.title }}</h3>
              <span class="text-[9px] text-gray-500 uppercase font-black">{{ note.createdAt | date:'shortTime' }}</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">{{ note.body }}</p>
            
            <button *ngIf="!note.isRead" (click)="mark(note.id)" 
                    class="mt-3 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
              Mark Read
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="notifications.length === 0" class="text-center py-24 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
        <div class="text-5xl mb-4 text-gray-700">🔔</div>
        <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">All caught up! No new activity.</p>
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
