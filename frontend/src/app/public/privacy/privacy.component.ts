import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-neutral-50 py-10 sm:py-20 px-4">
      <div class="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-neutral-100">
        
        <div class="mb-10 text-center">
          <h1 class="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">Privacy Policy</h1>
          <p class="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-3">LAST UPDATED: APRIL 2026</p>
        </div>

        <div class="space-y-8 text-neutral-700 leading-relaxed">
          <section>
            <h2 class="text-xl font-bold text-neutral-900 mb-3">1. Information We Collect</h2>
            <p>
              When you use <strong>PitchConnect</strong>, we collect the information you provide to us directly. This includes your account registration details (such as your name, email address, role, and encrypted password). 
              If you link an external platform (like LinkedIn), we also collect public profile data authorised by you.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We primarily use your information to operate and improve the FounderHub platform. Specifically, we use it to:
            </p>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li>Facilitate dynamic connections between Founders and Investors.</li>
              <li>Provide our core matching algorithms and personalized recommendations.</li>
              <li>Communicate platform updates, deal alerts, and important security notices.</li>
              <li>Maintain the overall security, trust, and integrity of the FounderHub community.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 mb-3">3. Data Sharing and Disclosure</h2>
            <p>
              FounderHub operates on a foundation of trust. We do not sell your personal data to third parties.
              Your public profile data (startup idea details, bio, experience) is securely shared with registered platform members 
              to facilitate networking according to our platform constraints. Private messages remain strictly confidential and end-to-end encrypted.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard organizational and technical measures designed to protect your personal information against accidental, unlawful, or unauthorized destruction, loss, alteration, access, disclosure, or use.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-neutral-900 mb-3">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about this privacy policy, please contact us by visiting our <a href="/contact" class="text-primary-600 font-semibold hover:underline">Contact page</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  `
})
export class PrivacyComponent {
}
