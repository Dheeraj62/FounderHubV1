import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, AvatarComponent, RouterLink, FooterComponent],
    template: `
    <div class="min-h-screen bg-background font-sans">
      
      <!-- DESKTOP SIDEBAR -->
      <app-sidebar [userRole]="authService.getRole()" class="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border overflow-y-auto"></app-sidebar>

      <!-- MOBILE OVERLAY & DRAWER -->
      <div *ngIf="isMobileMenuOpen()" class="lg:hidden fixed inset-0 z-50 flex">
        <div (click)="toggleMobileMenu()" class="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"></div>
        <app-sidebar [userRole]="authService.getRole()" class="relative w-64 bg-white border-r border-border overflow-y-auto h-full"></app-sidebar>
      </div>

      <!-- MAIN AREA -->
      <div class="lg:ml-64 flex flex-col min-h-screen">
        
        <!-- TOP HEADER -->
        <header class="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
          <div class="flex items-center gap-4">
            <button (click)="toggleMobileMenu()" class="lg:hidden p-2 text-textSecondary hover:bg-neutral-100 rounded-xl transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h2 class="text-sm font-bold text-textSecondary uppercase tracking-widest hidden sm:block">
               {{ getBreadcrumb() }}
            </h2>
          </div>

          <div class="flex items-center gap-3 sm:gap-6">
            <!-- Search / Global Action -->
            <button class="p-2 text-textSecondary hover:text-textPrimary transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <!-- Notifications Shortcut -->
            <button routerLink="/notifications" class="relative p-2 text-textSecondary hover:text-textPrimary transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            <div class="h-6 w-px bg-border hidden sm:block"></div>

            <div class="relative flex items-center gap-3">
              <div class="relative cursor-pointer group" (click)="toggleProfileMenu($event)">
                <app-avatar [initials]="(authService.getRole() || 'U')[0]" size="sm" color="primary" class="hover:opacity-80 transition-opacity"></app-avatar>
                
                <!-- Dropdown Menu -->
                <div *ngIf="isProfileMenuOpen()" class="absolute right-0 mt-3 w-48 bg-white border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div class="px-4 py-2 border-b border-border mb-1">
                    <p class="text-xs font-bold text-textSecondary uppercase tracking-widest">Signed in as</p>
                    <p class="text-sm font-semibold text-textPrimary truncate">{{ authService.getRole() }}</p>
                  </div>
                  
                  <button [routerLink]="['/', authService.getRole()?.toLowerCase(), 'profile']" 
                          class="w-full text-left px-4 py-2 text-sm text-textPrimary hover:text-primary-600 hover:bg-neutral-50 transition-colors flex items-center">
                    <span class="mr-2">👤</span> My Profile
                  </button>
                  
                  <button (click)="logout()" 
                          class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center mt-1 border-t border-border">
                    <span class="mr-2">🚪</span> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- CONTENT SCROLL AREA -->
        <main class="flex-1">
          <div class="layout-container">
            <router-outlet></router-outlet>
          </div>
        </main>
        
        <app-footer></app-footer>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
    authService = inject(AuthService);
    router = inject(Router);
    private routerSub?: Subscription;

    isMobileMenuOpen = signal(false);
    isProfileMenuOpen = signal(false);

    ngOnInit() {
        // Automatically close the mobile menu when a navigation completes
        this.routerSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.isMobileMenuOpen.set(false);
            this.isProfileMenuOpen.set(false);
        });
        
        // Close profile menu if clicked outside
        document.addEventListener('click', this.closeProfileMenuOutside.bind(this));
    }

    ngOnDestroy() {
        this.routerSub?.unsubscribe();
        document.removeEventListener('click', this.closeProfileMenuOutside.bind(this));
    }

    closeProfileMenuOutside(event: Event) {
        this.isProfileMenuOpen.set(false);
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    toggleProfileMenu(event: Event) {
        event.stopPropagation();
        this.isProfileMenuOpen.update(v => !v);
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
