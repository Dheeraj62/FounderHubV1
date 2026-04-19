import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppConstants } from '../../core/constants/app.constants';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-neutral-50 py-10 sm:py-20 px-3 sm:px-4">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">Get in Touch</h1>
          <p class="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-2">WE'RE HERE TO HELP YOUR ECOSYSTEM</p>
        </div>

        <div class="max-w-2xl mx-auto">
          <!-- Contact Form -->
          <div class="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg">
            
            <!-- Success message -->
            <div *ngIf="sent" class="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="text-sm font-medium text-emerald-800">Your email client has been opened. Send the email to complete your message!</p>
            </div>

            <form class="space-y-5" (ngSubmit)="sendMessage()" #contactForm="ngForm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label class="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
                  <input type="text" [(ngModel)]="form.name" name="name" required
                         class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 sm:p-3 text-sm text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                         placeholder="Jane Doe">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-neutral-700 mb-1.5">Email Address <span class="text-red-500">*</span></label>
                  <input type="email" [(ngModel)]="form.email" name="email" required
                         class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 sm:p-3 text-sm text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                         placeholder="jane@example.com">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-1.5">Subject</label>
                <select [(ngModel)]="form.subject" name="subject"
                        class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 sm:p-3 text-sm text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none">
                  <option>General Support</option>
                  <option>Partnership Inquiry</option>
                  <option>Press</option>
                  <option>Billing Issue</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-1.5">Message <span class="text-red-500">*</span></label>
                <textarea rows="5" [(ngModel)]="form.message" name="message" required
                          class="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 sm:p-3 text-sm text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none" 
                          placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" [disabled]="contactForm.invalid"
                      class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-500/30 text-sm sm:text-base flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  contactEmail = AppConstants.CONTACT_EMAIL;
  sent = false;

  form = {
    name: '',
    email: '',
    subject: 'General Support',
    message: ''
  };

  sendMessage(): void {
    if (!this.form.name || !this.form.email || !this.form.message) return;

    const subject = encodeURIComponent(`[${this.form.subject}] Message from ${this.form.name}`);
    const body = encodeURIComponent(
      `Name: ${this.form.name}\n` +
      `Email: ${this.form.email}\n` +
      `Subject: ${this.form.subject}\n\n` +
      `Message:\n${this.form.message}`
    );

    // Open the user's mail client with pre-filled fields
    window.location.href = `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;

    this.sent = true;
  }
}

