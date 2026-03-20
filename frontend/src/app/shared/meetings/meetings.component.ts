import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingService, MeetingDto, RequestMeetingDto } from '../../core/services/meeting.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../ui/toast/toast.service';
import { CardComponent } from '../ui/card/card.component';
import { ButtonComponent } from '../ui/button/button.component';
import { BadgeComponent } from '../ui/badge/badge.component';

@Component({
    selector: 'app-meetings',
    standalone: true,
    imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, BadgeComponent],
    template: `
    <div class="h-full flex flex-col p-4 sm:p-8 space-y-8">

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Meetings</h1>
        <p class="text-neutral-500 font-medium mt-1">
          {{ isInvestor ? 'Schedule and track meetings with founders.' : 'Manage your investor meeting requests.' }}
        </p>
      </div>

      <!-- Schedule Meeting Form (Investor only) -->
      <app-card *ngIf="isInvestor">
        <h2 class="text-base font-bold text-neutral-800 mb-5">Request a Meeting</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Founder ID</label>
            <input [(ngModel)]="form.founderId" type="text" placeholder="Paste founder user ID"
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Idea ID (optional)</label>
            <input [(ngModel)]="form.ideaId" type="text" placeholder="Paste idea ID (optional)"
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Date & Time</label>
            <input [(ngModel)]="form.scheduledAt" type="datetime-local"
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Platform</label>
            <select [(ngModel)]="form.platform"
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
              <option value="Video Call">Video Call</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Meeting Link (optional)</label>
            <input [(ngModel)]="form.meetingLink" type="url" placeholder="https://zoom.us/..."
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">Notes (optional)</label>
            <textarea [(ngModel)]="form.notes" rows="2" placeholder="Agenda or notes for the meeting"
              class="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"></textarea>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <app-button variant="primary" (onClick)="scheduleMeeting()" [disabled]="isScheduling() || !form.founderId || !form.scheduledAt">
            {{ isScheduling() ? 'Requesting...' : '📅 Request Meeting' }}
          </app-button>
        </div>
      </app-card>

      <!-- Meeting List -->
      <div>
        <h2 class="text-lg font-bold text-neutral-800 mb-4">Upcoming &amp; Past Meetings</h2>

        <div *ngIf="isLoading()" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div *ngIf="!isLoading() && meetings().length === 0" class="flex flex-col items-center py-16 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center">
          <span class="text-5xl mb-3">📅</span>
          <p class="text-neutral-500 font-medium">No meetings yet.</p>
        </div>

        <div class="space-y-4" *ngIf="!isLoading() && meetings().length > 0">
          <app-card *ngFor="let meeting of meetings()" class="hover:shadow-md transition-shadow">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <app-badge [variant]="statusVariant(meeting.status)">{{ meeting.status }}</app-badge>
                  <span class="text-xs text-neutral-500 font-medium">{{ meeting.platform }}</span>
                </div>
                <p class="text-sm font-bold text-neutral-800">
                  {{ isInvestor ? 'With ' + meeting.founderName : 'From ' + meeting.investorName }}
                </p>
                <p *ngIf="meeting.ideaTitle" class="text-xs text-neutral-500 mt-0.5">Re: {{ meeting.ideaTitle }}</p>
                <p class="text-xs text-neutral-500 mt-1">📅 {{ meeting.scheduledAt | date:'medium' }}</p>
                <a *ngIf="meeting.meetingLink" [href]="meeting.meetingLink" target="_blank"
                   class="text-xs text-primary-600 font-bold hover:underline mt-1 block">🔗 Join Meeting</a>
                <p *ngIf="meeting.notes" class="text-xs text-neutral-400 italic mt-1">"{{ meeting.notes }}"</p>
              </div>

              <!-- Founder status action buttons -->
              <div *ngIf="!isInvestor && meeting.status === 'Pending'" class="flex gap-2 shrink-0">
                <app-button variant="primary" size="sm" (onClick)="updateStatus(meeting.id, 'Confirmed')">Confirm</app-button>
                <app-button variant="danger" size="sm" (onClick)="updateStatus(meeting.id, 'Declined')">Decline</app-button>
              </div>
              <div *ngIf="!isInvestor && meeting.status === 'Confirmed'" class="shrink-0">
                <app-button variant="ghost" size="sm" (onClick)="updateStatus(meeting.id, 'Completed')">Mark Done</app-button>
              </div>
            </div>
          </app-card>
        </div>
      </div>

    </div>
  `
})
export class MeetingsComponent implements OnInit {
    private meetingService = inject(MeetingService);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    meetings = signal<MeetingDto[]>([]);
    isLoading = signal(true);
    isScheduling = signal(false);
    isInvestor = this.authService.getUserRole() === 'Investor';

    form: RequestMeetingDto & { ideaId?: string } = {
        founderId: '',
        ideaId: '',
        scheduledAt: '',
        platform: 'Video Call',
        meetingLink: '',
        notes: ''
    };

    ngOnInit() {
        this.loadMeetings();
    }

    loadMeetings() {
        this.meetingService.getMyMeetings().subscribe({
            next: (data) => {
                this.meetings.set(data);
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    scheduleMeeting() {
        this.isScheduling.set(true);
        this.meetingService.requestMeeting({
            founderId: this.form.founderId,
            ideaId: this.form.ideaId || undefined,
            scheduledAt: new Date(this.form.scheduledAt).toISOString(),
            platform: this.form.platform,
            meetingLink: this.form.meetingLink || undefined,
            notes: this.form.notes || undefined
        }).subscribe({
            next: (newMeeting) => {
                this.meetings.update(list => [newMeeting, ...list]);
                this.form = { founderId: '', ideaId: '', scheduledAt: '', platform: 'Video Call', meetingLink: '', notes: '' };
                this.isScheduling.set(false);
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.toastService.error('Failed to request meeting. Check the Founder ID.');
                this.isScheduling.set(false);
                this.cdr.markForCheck();
            }
        });
    }

    updateStatus(meetingId: string, status: 'Confirmed' | 'Declined' | 'Completed') {
        this.meetingService.updateStatus(meetingId, { status }).subscribe({
            next: () => {
                this.meetings.update(list => list.map(m => m.id === meetingId ? { ...m, status } : m));
                this.cdr.markForCheck();
            }
        });
    }

    statusVariant(status: string): 'success' | 'warning' | 'error' | 'neutral' | 'indigo' {
        if (status === 'Confirmed') return 'success';
        if (status === 'Pending') return 'warning';
        if (status === 'Declined') return 'error';
        if (status === 'Completed') return 'indigo';
        return 'neutral';
    }
}
