import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { AppConstants } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FooterComponent],
  template: `
    <div class="min-h-screen bg-neutral-50 flex flex-col font-sans">
      
      <!-- Public Navbar -->
      <header class="bg-white border-b border-neutral-200 sticky top-0 z-40 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 shrink-0">
             <img src="/assets/images/logo-dark.png" alt="Logo" class="h-8 w-8 rounded-xl shadow-sm" onerror="this.src='/assets/images/logo.png'"/>
             <span class="text-xl font-black text-neutral-900 tracking-tight">{{ appName }}</span>
          </a>
          
          <div class="flex items-center gap-4">
            <a routerLink="/auth/login" class="text-sm font-bold text-neutral-600 hover:text-primary-600 transition-colors">Sign In</a>
            <a routerLink="/auth/register" class="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap">Register</a>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Public Footer -->
      <app-footer></app-footer>

    </div>
  `
})
export class PublicLayoutComponent {
  appName = AppConstants.APP_NAME;
}
