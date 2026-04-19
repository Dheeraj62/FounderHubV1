import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppConstants } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white border-t border-neutral-200 py-6 sm:py-8 px-4 sm:px-8 mt-auto z-10 shrink-0">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div class="flex items-center gap-2">
          <img src="/assets/images/logo.png" alt="Logo" class="h-5 w-5 rounded-md shadow-sm" />
          <span class="text-sm font-black text-neutral-900 tracking-tight">{{ appName }}</span>
          <span class="text-xs text-neutral-500 ml-2">&copy; {{ currentYear }} All rights reserved.</span>
        </div>

        <nav class="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <a routerLink="/about" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">About Us</a>
          <a routerLink="/privacy-policy" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
          <a routerLink="/contact" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Contact
          </a>
        </nav>
        
      </div>
    </footer>
  `
})
export class FooterComponent {
  appName = AppConstants.APP_NAME;
  contactEmail = AppConstants.CONTACT_EMAIL;
  currentYear = new Date().getFullYear();
}

