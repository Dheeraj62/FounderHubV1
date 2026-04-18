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
      <header class="relative z-10 w-full pt-6 px-4">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="/assets/images/logo.png" alt="Logo" class="h-8 w-8 rounded-xl shadow-lg ring-1 ring-white/10" />
            <span class="text-xl font-black text-white tracking-tight">{{ appName }}</span>
          </a>
          <div class="flex items-center gap-4">
            <a routerLink="/auth/login" class="text-sm font-bold text-gray-300 hover:text-white transition-colors py-2">Sign In</a>
            <a routerLink="/auth/register" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">Register Now</a>
          </div>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="relative z-10 py-24 px-4 text-center max-w-4xl mx-auto">
        <div class="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 text-sm text-indigo-200 font-medium shadow-inner shadow-white/5">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Now in Early Access · Join 500+ Founders
          </div>

          <!-- Headline -->
          <h1 class="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Where Visionary
            <br>
            <span class="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent filter brightness-125 drop-shadow-md">
              Founders Meet
            </span>
            <br>
            Bold Investors
          </h1>

          <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Stop cold-pitching. Start connecting. {{ appName }} is the signal in the noise — a curated platform where the best startup ideas find the right capital.
          </p>

          <!-- CTA Buttons -->
          <div class="flex gap-4 justify-center">
            <a routerLink="/auth/register" class="app-button-primary text-base px-8 py-3 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              Get Started Free
              <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a routerLink="/auth/login" class="app-button-secondary text-base px-8 py-3 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-xl">
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
      <section class="relative border-y border-white/5 bg-white/[0.02] py-10 px-4">
        <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/10">
          <div>
            <div class="text-4xl font-extrabold text-white mb-1 drop-shadow-md">500+</div>
            <div class="text-sm text-gray-400 font-medium">Startup Ideas</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1 drop-shadow-md">120+</div>
            <div class="text-sm text-gray-400 font-medium">Active Investors</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1 drop-shadow-md">$4.2M</div>
            <div class="text-sm text-gray-400 font-medium">Funding Connected</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1 drop-shadow-md">48h</div>
            <div class="text-sm text-gray-400 font-medium">Avg. First Response</div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="relative py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-16 bg-black/40 backdrop-blur-md w-max mx-auto px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl">
          <p class="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 class="text-4xl font-extrabold text-white drop-shadow-md">Simple. Fast. Powerful.</h2>
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
      <section class="relative py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-16 bg-black/40 backdrop-blur-md w-max mx-auto px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl">
          <p class="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-3">Platform Features</p>
          <h2 class="text-4xl font-extrabold text-white drop-shadow-md">Built for serious builders</h2>
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
      <section class="relative py-24 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="relative p-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent">
            <!-- glow -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-xl -z-10"></div>
            <h2 class="text-4xl font-extrabold text-white mb-4">Ready to launch your idea?</h2>
            <p class="text-gray-400 mb-8">Join thousands of founders who've already found their investors on {{ appName }}.</p>
            <a routerLink="/auth/register"
              class="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
              Create Free Account
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class LandingComponent {
  appName = AppConstants.APP_NAME;
  features = [
    { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered filters connect you with investors who actually care about your vertical.' },
    { icon: '🔒', title: 'Role-Based Access', desc: 'Founders post, investors discover. Clean, purpose-built experience for each role.' },
    { icon: '📊', title: 'Real-Time Interest', desc: 'See who is interested, who said maybe, and who passed — instantly.' },
    { icon: '🏷️', title: 'Structured Pitches', desc: 'No fluff. Our pitch format ensures every idea is clear, comparable, and compelling.' },
    { icon: '🔄', title: 'Rejection Resilience', desc: 'VC-rejected ideas get a second chance. Track what changed and why it matters now.' },
    { icon: '⚡', title: 'Rapid Response', desc: 'Average investor response time under 48 hours. No more months of waiting.' },
  ];
}
