import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppConstants } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white border-t border-neutral-200 py-8 px-4 sm:px-8 mt-auto z-10 shrink-0">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div class="flex items-center gap-2">
          <img src="/assets/images/logo.png" alt="Logo" class="h-5 w-5 rounded-md shadow-sm" />
          <span class="text-sm font-black text-neutral-900 tracking-tight">{{ appName }}</span>
          <span class="text-xs text-neutral-500 ml-2">&copy; {{ currentYear }} All rights reserved.</span>
        </div>

        <nav class="flex items-center gap-6">
          <a routerLink="/about" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">About Us</a>
          <a routerLink="/contact" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">Contact</a>
      <!--   <a href="#" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
          <a href="#" class="text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors">Terms of Service</a> -->
        </nav>
        
      </div>
    </footer>
  `
})
export class FooterComponent {
  appName = AppConstants.APP_NAME;
  currentYear = new Date().getFullYear();
}
