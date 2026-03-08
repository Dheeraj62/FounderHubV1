import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, AvatarComponent, RouterLink],
    template: `
    <div class="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      
      <!-- DESKTOP SIDEBAR -->
      <app-sidebar [userRole]="authService.getRole()" class="hidden lg:block shrink-0"></app-sidebar>

      <!-- MOBILE OVERLAY & DRAWER (TODO: Implement in next step) -->
      <div *ngIf="isMobileMenuOpen()" class="lg:hidden fixed inset-0 z-50 flex">
        <div (click)="toggleMobileMenu()" class="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in transition-opacity"></div>
        <app-sidebar [userRole]="authService.getRole()" class="relative animate-in slide-in-from-left duration-300"></app-sidebar>
      </div>

      <!-- MAIN AREA -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <!-- TOP HEADER -->
        <header class="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0">
          <div class="flex items-center gap-4">
            <button (click)="toggleMobileMenu()" class="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h2 class="text-sm font-black text-neutral-500 uppercase tracking-widest hidden sm:block">
               {{ getBreadcrumb() }}
            </h2>
          </div>

          <div class="flex items-center gap-3 sm:gap-6">
            <!-- Search / Global Action -->
            <button class="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <!-- Notifications Shortcut -->
            <button routerLink="/notifications" class="relative p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            <div class="h-6 w-px bg-neutral-200 hidden sm:block"></div>

            <div class="flex items-center gap-3">
               <button (click)="logout()" class="text-xs font-black text-neutral-400 hover:text-rose-600 uppercase tracking-widest transition-colors mr-2">
                Logout
              </button>
              <app-avatar [initials]="(authService.getRole() || 'U')[0]" size="sm" color="indigo" class="cursor-pointer hover:opacity-80 transition-opacity"></app-avatar>
            </div>
          </div>
        </header>

        <!-- CONTENT SCROLL AREA -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-8">
          <div class="layout-container py-4">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardLayoutComponent {
    authService = inject(AuthService);
    router = inject(Router);

    isMobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    getBreadcrumb(): string {
        const url = this.router.url;
        if (url.includes('dashboard')) return 'Overview';
        if (url.includes('feed')) return 'Community';
        if (url.includes('notifications')) return 'Updates';
        if (url.includes('connections')) return 'Network';
        if (url.includes('profile')) return 'Settings';
        return 'FounderHub';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
