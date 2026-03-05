import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col" [class]="isLanding ? 'bg-[#0a0a0f]' : 'bg-gray-50'">

      <!-- NAVBAR -->
      <nav [class]="isLanding
          ? 'fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300'
          : 'sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">

            <!-- Logo -->
            <div class="flex items-center">
              <a routerLink="/" class="flex items-center gap-2.5">
                <div [class]="isLanding ? 'bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg' : 'bg-indigo-600 p-1.5 rounded-lg'">
                  <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span [class]="isLanding ? 'text-xl font-extrabold text-white tracking-tight' : 'text-xl font-extrabold text-gray-900 tracking-tight'">
                  Founder<span [class]="isLanding ? 'text-indigo-400' : 'text-indigo-600'">Hub</span>
                </span>
              </a>
            </div>

            <!-- Right side nav -->
            <div class="flex items-center space-x-3">
              <!-- Logged out state -->
              <ng-container *ngIf="!authService.getToken()">
                <a routerLink="/auth/login"
                  [class]="isLanding
                    ? 'text-gray-300 hover:text-white font-medium text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition-all'
                    : 'text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-xl hover:bg-gray-100 transition-all'">
                  Log in
                </a>
                <a routerLink="/auth/register"
                  class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5">
                  Get Started
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </ng-container>

              <!-- Logged in state -->
              <ng-container *ngIf="authService.getToken()">
                <div class="flex items-center space-x-4">
                  
                  <!-- Shared Nav -->
                  <div class="flex items-center space-x-3 mr-4 pr-4 border-r border-gray-200">
                    <a routerLink="/feed" class="text-gray-500 hover:text-indigo-600 p-1 transition-colors" title="Feed">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 11H5m14-6H5m14 12H5m14 6H5" />
                      </svg>
                    </a>
                    <a routerLink="/notifications" class="text-gray-500 hover:text-indigo-600 relative p-1 transition-colors" title="Notifications">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                      </svg>
                      <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                    </a>
                    <a routerLink="/connections" class="text-gray-500 hover:text-indigo-600 p-1 transition-colors" title="My Network">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </a>
                  </div>

                  <ng-container *ngIf="authService.getRole() === 'Founder'">
                    <a routerLink="/founder/dashboard" class="text-gray-600 hover:text-gray-900 font-semibold text-sm px-2 py-1 transition-all">Dashboard</a>
                    <a routerLink="/founder/profile" class="text-gray-600 hover:text-gray-900 font-semibold text-sm px-2 py-1 transition-all">My Profile</a>
                    <a routerLink="/founder/create-idea" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/20 transition-all">
                      <span class="text-lg leading-none mt-[-2px]">+</span> Post Idea
                    </a>
                  </ng-container>

                  <ng-container *ngIf="authService.getRole() === 'Investor'">
                    <a routerLink="/investor/browse" class="text-gray-600 hover:text-gray-900 font-semibold text-sm px-2 py-1 transition-all">Browse</a>
                    <a routerLink="/investor/recommendations" class="text-indigo-600 hover:text-indigo-700 font-bold text-sm px-2 py-1 transition-all flex items-center gap-1">
                      <span class="text-lg">✨</span> Matches
                    </a>
                    <a routerLink="/investor/saved-ideas" class="text-gray-600 hover:text-gray-900 font-semibold text-sm px-2 py-1 transition-all">Saved</a>
                    <a routerLink="/investor/profile" class="text-gray-600 hover:text-gray-900 font-semibold text-sm px-2 py-1 transition-all">Criteria</a>
                  </ng-container>

                  <div class="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-500/20 uppercase">
                      {{ (authService.getRole() || 'U')[0] }}
                    </div>
                    <button (click)="logout()" class="text-sm text-gray-400 hover:text-rose-500 font-bold transition-colors">Logout</button>
                  </div>
                </div>
              </ng-container>
            </div>

          </div>
        </div>
      </nav>

      <!-- MAIN CONTENT -->
      <main [class]="isLanding ? 'flex-grow' : 'flex-grow pt-0'">
        <div [class]="isLanding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- FOOTER -->
      <footer [class]="isLanding
          ? 'border-t border-white/5 bg-[#0a0a0f] py-8 px-4'
          : 'bg-white border-t border-gray-200 py-6 px-4'">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-md">
              <svg class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span [class]="isLanding ? 'text-gray-400' : 'text-gray-500'">© {{ currentYear }} FounderHub. All rights reserved.</span>
          </div>
          <div [class]="isLanding ? 'text-gray-600 text-xs' : 'text-gray-400 text-xs'">
            Connecting visionary founders with bold investors.
          </div>
        </div>
      </footer>

    </div>
  `,
  styles: []
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentYear = new Date().getFullYear();
  isLanding = false;

  constructor() {
    // Track route to apply landing-specific styles to navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLanding = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '';
      this.cdr.markForCheck();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
