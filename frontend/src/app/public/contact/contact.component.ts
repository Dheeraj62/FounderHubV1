import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-neutral-50 py-20 px-4">
      <div class="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-3xl p-10 md:p-12 shadow-lg">
        
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-neutral-900 tracking-tight">Get in Touch</h1>
          <p class="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-2">WE'RE HERE TO HELP YOUR ECOSYSTEM</p>
        </div>

        <form class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
            <input type="text" class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm shadow-neutral-100" placeholder="Jane Doe">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
            <input type="email" class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm shadow-neutral-100" placeholder="jane@example.com">
          </div>

          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">Subject</label>
            <select class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm shadow-neutral-100">
              <option>General Support</option>
              <option>Partnership Inquiry</option>
              <option>Press</option>
              <option>Billing Issue</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">Message</label>
            <textarea rows="5" class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm shadow-neutral-100 resize-none" placeholder="How can we help you?"></textarea>
          </div>

          <button type="button" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-500/30">
            Send Message
          </button>
        </form>

      </div>
    </div>
  `
})
export class ContactComponent {}
