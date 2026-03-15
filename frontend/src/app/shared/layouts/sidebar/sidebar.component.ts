import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarComponent],
  template: `
    <div class="flex flex-col h-full bg-white border-r border-neutral-200 w-64">
      <div class="h-16 flex items-center px-6 border-b border-neutral-100">
        <a routerLink="/" class="flex items-center gap-2.5">
          <div class="bg-primary-600 p-1.5 rounded-xl shadow-sm">
            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xl font-black text-neutral-900 tracking-tight">FounderHub</span>
        </a>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div class="pb-2">
          <p class="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Main Menu</p>
          
          <ng-container *ngIf="userRole === 'Founder'">
            <a routerLink="/founder/dashboard" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </a>

            <a routerLink="/founder/analytics" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Analytics
            </a>
            <a routerLink="/founder/updates" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
              </svg>
              Post Updates
            </a>
          </ng-container>

          <ng-container *ngIf="userRole === 'Investor'">
            <a routerLink="/investor/browse" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Browse Ideas
            </a>
            <a routerLink="/investor/pipeline" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Deal Pipeline
            </a>
            <a routerLink="/investor/watchlist" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Watchlist
            </a>
            <a routerLink="/investor/recommendations" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
              <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Matches
            </a>
          </ng-container>

          <a routerLink="/feed" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            Community Feed
          </a>
        </div>

        <div class="pt-6">
          <p class="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Network</p>
          <a routerLink="/connections" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            My Connections
          </a>
          <a routerLink="/notifications" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Notifications
          </a>
          <a routerLink="/meetings" routerLinkActive="bg-primary-50 text-primary-700 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Meetings
          </a>
        </div>
      </nav>

      <div class="p-4 border-t border-neutral-100">
        <div class="flex items-center gap-3 p-2 bg-neutral-50 rounded-2xl border border-neutral-100">
          <app-avatar [initials]="(userRole || 'U')[0]" size="sm" color="indigo"></app-avatar>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-black text-neutral-900 truncate">{{ userRole }} Account</p>
            <p class="text-[10px] text-neutral-500 truncate italic">FounderHub Platinum</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() userRole: string | null = null;
}
