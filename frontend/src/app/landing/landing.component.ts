import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../core/constants/app.constants';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

      <!-- Animated background grid -->
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none z-0"></div>

      <!-- Full-screen hero image background -->
      <div class="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen" style="background-image: url('/assets/images/hero-bg.png'); background-size: cover; background-position: center; -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 80%); mask-image: radial-gradient(circle at center, black 0%, transparent 80%);"></div>

      <!-- Glowing orbs -->
      <div class="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-700 opacity-[0.07] blur-[120px] pointer-events-none z-0"></div>
      <div class="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700 opacity-[0.07] blur-[120px] pointer-events-none z-0"></div>

      <!-- Navbar -->
      <header class="relative z-10 w-full pt-4 sm:pt-6 px-4">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a routerLink="/" class="flex items-center gap-2 shrink-0">
            <img src="/assets/images/logo.png" alt="Logo" class="h-7 w-7 sm:h-8 sm:w-8 rounded-xl shadow-lg ring-1 ring-white/10" />
            <span class="text-base sm:text-xl font-black text-white tracking-tight">{{ appName }}</span>
          </a>
          <div class="flex items-center gap-2 sm:gap-4">
            <a routerLink="/auth/login" class="text-xs sm:text-sm font-bold text-gray-300 hover:text-white transition-colors py-2">Sign In</a>
            <a routerLink="/auth/register" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap">Register Now</a>
          </div>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="relative z-10 py-12 sm:py-24 px-4 text-center max-w-4xl mx-auto">
        <div class="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 md:p-14 shadow-2xl space-y-4 sm:space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 mb-4 sm:mb-8 px-3 sm:px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 text-xs sm:text-sm text-indigo-200 font-medium shadow-inner shadow-white/5">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Now in Early Access · Join 500+ Founders
          </div>

          <!-- Headline -->
          <h1 class="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.08] mb-4 sm:mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Where Visionary
            <br>
            <span class="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent filter brightness-125 drop-shadow-md">
              Founders Meet
            </span>
            <br>
            Bold Investors
          </h1>

          <p class="text-sm sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed font-medium">
            Stop cold-pitching. Start connecting. {{ appName }} is the signal in the noise — a curated platform where the best startup ideas find the right capital.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a routerLink="/auth/register" class="app-button-primary text-sm sm:text-base px-6 sm:px-8 py-3 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              Get Started Free
              <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a routerLink="/auth/login" class="app-button-secondary text-sm sm:text-base px-6 sm:px-8 py-3 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-xl">
              Sign In
            </a>
          </div>
        </div>

        <!-- Social proof row -->
        <div class="mt-16 flex flex-wrap gap-8 justify-center items-center text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-bold">S</div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-bold">M</div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-bold">A</div>
            </div>
            <span>Trusted by founders & investors worldwide</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex text-yellow-400 text-xs">★★★★★</div>
            <span>4.9/5 from 200+ reviews</span>
          </div>
        </div>
      </section>

      <!-- STATS STRIP -->
      <section class="relative border-y border-white/5 bg-white/[0.02] py-8 sm:py-10 px-4">
        <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10">
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-md">500+</div>
            <div class="text-xs sm:text-sm text-gray-400 font-medium">Startup Ideas</div>
          </div>
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-md">120+</div>
            <div class="text-xs sm:text-sm text-gray-400 font-medium">Active Investors</div>
          </div>
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-md">$4.2M</div>
            <div class="text-xs sm:text-sm text-gray-400 font-medium">Funding Connected</div>
          </div>
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-md">48h</div>
            <div class="text-xs sm:text-sm text-gray-400 font-medium">Avg. First Response</div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="relative py-12 sm:py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16 bg-black/40 backdrop-blur-md w-full sm:w-max mx-auto px-6 sm:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-2xl">
          <p class="text-indigo-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 sm:mb-3">How It Works</p>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">Simple. Fast. Powerful.</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">🚀</div>
            <div class="text-xs text-indigo-300 font-semibold uppercase tracking-widest mb-2">Step 01</div>
            <h3 class="text-xl font-bold text-white mb-3 drop-shadow-sm">Post Your Idea</h3>
            <p class="text-gray-300 text-sm leading-relaxed">Founders craft a structured pitch — problem, solution, stage, industry. Clarity over hype.</p>
          </div>
          <div class="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/[0.05] hover:border-purple-500/50 transition-all duration-300 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/40 to-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">🔍</div>
            <div class="text-xs text-purple-300 font-semibold uppercase tracking-widest mb-2">Step 02</div>
            <h3 class="text-xl font-bold text-white mb-3 drop-shadow-sm">Investors Discover</h3>
            <p class="text-gray-300 text-sm leading-relaxed">Investors browse curated ideas filtered by stage, industry, and track record. No noise.</p>
          </div>
          <div class="group relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/[0.05] hover:border-pink-500/50 transition-all duration-300 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/40 to-pink-500/10 border border-pink-500/30 flex items-center justify-center text-2xl mb-6 shadow-[0_0_20px_rgba(236,72,153,0.2)]">🤝</div>
            <div class="text-xs text-pink-300 font-semibold uppercase tracking-widest mb-2">Step 03</div>
            <h3 class="text-xl font-bold text-white mb-3 drop-shadow-sm">Connect & Close</h3>
            <p class="text-gray-300 text-sm leading-relaxed">Investors signal interest. Founders see validated traction. Deals happen faster than ever.</p>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="relative py-12 sm:py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16 bg-black/40 backdrop-blur-md w-full sm:w-max mx-auto px-6 sm:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-2xl">
          <p class="text-purple-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 sm:mb-3">Platform Features</p>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">Built for serious builders</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let feature of features" class="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all shadow-lg">
            <div class="text-3xl mb-4">{{ feature.icon }}</div>
            <h3 class="font-bold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="relative py-12 sm:py-24 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="relative p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent">
            <!-- glow -->
            <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-xl -z-10"></div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">Ready to launch your idea?</h2>
            <p class="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">Join thousands of founders who've already found their investors on {{ appName }}.</p>
            <a routerLink="/auth/register"
              class="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
              Create Free Account
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="relative z-10 border-t border-white/5 bg-[#07070c]">
        <div class="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          
          <!-- Top Row: Brand + Links Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 mb-12">
            
            <!-- Brand Column -->
            <div class="sm:col-span-2 lg:col-span-1">
              <div class="flex items-center gap-2 mb-4">
                <img src="/assets/images/logo.png" alt="Logo" class="h-8 w-8 rounded-xl shadow-lg ring-1 ring-white/10" />
                <span class="text-lg font-black text-white tracking-tight">{{ appName }}</span>
              </div>
              <p class="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
                The curated platform where visionary founders meet bold investors. No noise, just signal.
              </p>
              <!-- Social Icons -->
              <div class="flex gap-3">
                <a href="#" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://github.com/Dheeraj62/FounderHubV1" target="_blank" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            <!-- Platform Column -->
            <div>
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Platform</h4>
              <ul class="space-y-3">
                <li><a routerLink="/auth/register" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">Get Started</a></li>
                <li><a routerLink="/about" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">About Us</a></li>
                <li><a routerLink="/auth/login" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">Sign In</a></li>
              </ul>
            </div>

            <!-- Resources Column -->
            <div>
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Resources</h4>
              <ul class="space-y-3">
                <li><a href="#" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">Terms of Service</a></li>
                <li><a href="#" class="text-sm text-gray-500 hover:text-white transition-colors font-medium">FAQ</a></li>
              </ul>
            </div>

            <!-- Contact Column -->
            <div>
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Contact Us</h4>
              <ul class="space-y-3">
                <li>
                  <a href="mailto:{{ contactEmail }}" class="text-sm text-gray-500 hover:text-indigo-400 transition-colors font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    {{ contactEmail }}
                  </a>
                </li>
                <li class="text-sm text-gray-500 font-medium flex items-start gap-2">
                  <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  India
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div class="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-xs text-gray-600 font-medium">&copy; {{ currentYear }} {{ appName }}. All rights reserved.</p>
            <p class="text-xs text-gray-600 font-medium">Built with 🤍 for founders & investors</p>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LandingComponent {
  appName = AppConstants.APP_NAME;
  contactEmail = AppConstants.CONTACT_EMAIL;
  currentYear = new Date().getFullYear();
  features = [
    { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered filters connect you with investors who actually care about your vertical.' },
    { icon: '🔒', title: 'Role-Based Access', desc: 'Founders post, investors discover. Clean, purpose-built experience for each role.' },
    { icon: '📊', title: 'Real-Time Interest', desc: 'See who is interested, who said maybe, and who passed — instantly.' },
    { icon: '🏷️', title: 'Structured Pitches', desc: 'No fluff. Our pitch format ensures every idea is clear, comparable, and compelling.' },
    { icon: '🔄', title: 'Rejection Resilience', desc: 'VC-rejected ideas get a second chance. Track what changed and why it matters now.' },
    { icon: '⚡', title: 'Rapid Response', desc: 'Average investor response time under 48 hours. No more months of waiting.' },
  ];
}

