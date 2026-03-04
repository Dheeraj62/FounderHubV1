import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { ConnectionService } from '../../../core/services/connection.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message, SendMessageRequest } from '../../../core/models/message.models';
import { Connection } from '../../../core/models/connection.models';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto py-6 px-4">
      <!-- Header -->
      <div class="bg-gray-900 border border-gray-800 rounded-t-3xl p-6 flex items-center justify-between shadow-2xl">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/20">
            {{ partnerName.charAt(0) }}
          </div>
          <div>
            <h2 class="text-white font-black text-xl tracking-tight">{{ partnerName }}</h2>
            <p class="text-emerald-400 text-[10px] uppercase font-bold tracking-widest flex items-center">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 bg-gray-900/50 border-x border-gray-800 overflow-y-auto p-8 space-y-6" #scrollContainer>
        <div *ngFor="let msg of messages" 
             [class]="isMe(msg.senderId) ? 'flex justify-end' : 'flex justify-start'">
          <div [class]="isMe(msg.senderId) ? 'bg-indigo-600 rounded-tr-none' : 'bg-gray-800 rounded-tl-none'"
               class="max-w-[70%] p-4 rounded-3xl shadow-xl text-white">
            <p class="text-sm leading-relaxed">{{ msg.content }}</p>
            <span class="text-[9px] text-gray-400 mt-2 block text-right font-bold uppercase tracking-tighter">
              {{ msg.sentAt | date:'shortTime' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-gray-900 border border-gray-800 rounded-b-3xl p-5 shadow-2xl">
        <form (ngSubmit)="send()" class="flex gap-4">
          <input type="text" [(ngModel)]="newMessage" name="msg" placeholder="Type a message..."
                 class="flex-1 bg-gray-800 border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
          <button type="submit" [disabled]="!newMessage.trim()"
                  class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-500/20">
            Send
          </button>
        </form>
      </div>
    </div>
  `,
  styles: []
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
