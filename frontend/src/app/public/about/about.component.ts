import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../../core/constants/app.constants';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-neutral-50 py-20 px-4">
      <div class="max-w-4xl mx-auto bg-white border border-neutral-200 rounded-3xl p-10 md:p-16 shadow-lg text-center">
        
        <div class="mb-8 flex justify-center">
            <img src="/assets/images/logo.png" alt="Logo" class="h-20 w-20 rounded-2xl shadow-sm" />
        </div>

        <h1 class="text-4xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tight">
          Accelerating <span class="text-primary-600">Innovation</span> Together
        </h1>
        
        <p class="text-lg text-neutral-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          {{ appName }} is the premier platform connecting ambitious founders with forward-thinking investors. 
          We believe that great ideas deserve the capital to grow, and great capital deserves the best ideas.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <h3 class="font-bold text-neutral-900 text-xl mb-2">Our Mission</h3>
            <p class="text-sm text-neutral-600">To democratize access to venture capital by breaking down warm-intro barriers through smart, data-driven matching.</p>
          </div>
          <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <h3 class="font-bold text-neutral-900 text-xl mb-2">Our Vision</h3>
            <p class="text-sm text-neutral-600">A world where the best ideas win, regardless of a founder's geographical location or traditional network graph.</p>
          </div>
          <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <h3 class="font-bold text-neutral-900 text-xl mb-2">The Platform</h3>
            <p class="text-sm text-neutral-600">By standardizing the pitch pipeline and verification layers, we've reduced investor diligence time by over 40%.</p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent {
  appName = AppConstants.APP_NAME;
}
