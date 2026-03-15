import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { ConnectionService } from '../../../core/services/connection.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message, SendMessageRequest } from '../../../core/models/message.models';
import { Connection } from '../../../core/models/connection.models';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { CardComponent } from '../../ui/card/card.component';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, AvatarComponent],
  template: `
    <div class="h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] flex flex-col bg-neutral-50/50">
      
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <app-button variant="ghost" size="sm" class="sm:hidden -ml-2 text-neutral-500" routerLink="/founder/dashboard">
            &larr;
          </app-button>
          <app-avatar [alt]="partnerName" size="md" variant="squircle" [online]="true" color="primary"></app-avatar>
          <div>
            <h2 class="text-neutral-900 font-bold text-lg tracking-tight leading-tight">{{ partnerName }}</h2>
            <div class="flex items-center text-xs font-semibold tracking-wide text-emerald-600">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Active Now
            </div>
          </div>
        </div>
      </header>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6" #scrollContainer>
        <div *ngIf="messages.length === 0" class="h-full flex flex-col items-center justify-center text-neutral-400">
          <svg class="w-12 h-12 mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-sm font-medium">No messages yet. Start the conversation!</p>
        </div>

        <div *ngFor="let msg of messages" 
             [class]="isMe(msg.senderId) ? 'flex justify-end' : 'flex justify-start'">
          <div [class]="isMe(msg.senderId) ? 'bg-primary-600 text-white rounded-br-none shadow-sm' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none shadow-sm'"
               class="max-w-[85%] sm:max-w-[70%] px-5 py-3.5 rounded-2xl relative group">
            <p class="text-[15px] leading-relaxed break-words">{{ msg.content }}</p>
            <span [class]="isMe(msg.senderId) ? 'text-primary-200' : 'text-neutral-400'"
                  class="text-[10px] font-bold uppercase tracking-wider mt-1.5 block text-right select-none">
              {{ msg.sentAt | date:'shortTime' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white border-t border-neutral-200/80 p-4 sm:p-5 safe-area-pb">
        <form (ngSubmit)="send()" class="flex gap-3 max-w-5xl mx-auto items-end">
          <div class="flex-1 relative">
            <textarea 
              [(ngModel)]="newMessage" 
              name="msg" 
              rows="1"
              placeholder="Type your message..."
              (keydown.enter)="$event.preventDefault(); send()"
              class="block w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all duration-200 resize-none max-h-32"
              ></textarea>
          </div>
          <app-button type="submit" [disabled]="!newMessage.trim()" variant="primary" size="md" class="shrink-0 pb-[2px]">
            Send
          </app-button>
        </form>
        <div class="text-center mt-2 hidden sm:block">
          <span class="text-[11px] text-neutral-400 font-medium tracking-wide">Press <kbd class="px-1 py-0.5 bg-neutral-100 border border-neutral-200 rounded">Enter</kbd> to send</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .safe-area-pb {
      padding-bottom: max(env(safe-area-inset-bottom), 1.25rem);
    }
  `]
})
export class MessageThreadComponent implements OnInit, OnDestroy {
  connectionId!: string;
  partnerId!: string;
  partnerName = 'Connection Partner';
  messages: Message[] = [];
  newMessage = '';
  currentUserId: string = '';
  pollInterval: any;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private connectionService: ConnectionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId() || '';
    this.connectionId = this.route.snapshot.paramMap.get('id')!;

    this.loadMessages();
    this.loadConnectionDetails();

    // Poll for new messages every 3 seconds (since we don't have signalr/real-time)
    this.pollInterval = setInterval(() => this.loadMessages(), 3000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadConnectionDetails() {
    this.connectionService.getMyConnections().subscribe(list => {
      const conn = list.find(c => c.id === this.connectionId);
      if (conn) {
        this.partnerId = conn.founderId === this.currentUserId ? conn.investorId : conn.founderId;
        this.cdr.markForCheck();
      }
    });
  }

  loadMessages() {
    this.messageService.getThread(this.connectionId).subscribe(list => {
      this.messages = list;
      this.cdr.markForCheck();
    });
  }

  isMe(senderId: string): boolean {
    return senderId === this.currentUserId;
  }

  send() {
    if (!this.newMessage.trim()) return;

    const request: SendMessageRequest = {
      connectionId: this.connectionId,
      recipientId: this.partnerId,
      content: this.newMessage
    };

    this.messageService.sendMessage(request).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}
