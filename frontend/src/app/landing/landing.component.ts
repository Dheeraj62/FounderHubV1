import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

      <!-- Animated background grid -->
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none"></div>

      <!-- Glowing orbs -->
      <div class="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-700 opacity-[0.07] blur-[120px] pointer-events-none"></div>
      <div class="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700 opacity-[0.07] blur-[120px] pointer-events-none"></div>

      <!-- HERO SECTION -->
      <section class="relative pt-32 pb-24 px-4 text-center max-w-5xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm text-indigo-300 font-medium">
          <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Now in Early Access · Join 500+ Founders
        </div>

        <!-- Headline -->
        <h1 class="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Where Visionary
          <br>
          <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Founders Meet
          </span>
          <br>
          Bold Investors
        </h1>

        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop cold-pitching. Start connecting. FounderHub is the signal in the noise — a curated platform where the best startup ideas find the right capital.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/auth/register"
            class="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
            Get Started Free
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a routerLink="/auth/login"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300">
            Sign In
          </a>
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
        <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-extrabold text-white mb-1">500+</div>
            <div class="text-sm text-gray-500">Startup Ideas</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1">120+</div>
            <div class="text-sm text-gray-500">Active Investors</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1">$4.2M</div>
            <div class="text-sm text-gray-500">Funding Connected</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-white mb-1">48h</div>
            <div class="text-sm text-gray-500">Avg. First Response</div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="relative py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 class="text-4xl font-extrabold text-white">Simple. Fast. Powerful.</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-2xl mb-6">🚀</div>
            <div class="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">Step 01</div>
            <h3 class="text-xl font-bold text-white mb-3">Post Your Idea</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Founders craft a structured pitch — problem, solution, stage, industry. Clarity over hype.</p>
          </div>
          <div class="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center text-2xl mb-6">🔍</div>
            <div class="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-2">Step 02</div>
            <h3 class="text-xl font-bold text-white mb-3">Investors Discover</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Investors browse curated ideas filtered by stage, industry, and track record. No noise.</p>
          </div>
          <div class="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-pink-500/30 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 flex items-center justify-center text-2xl mb-6">🤝</div>
            <div class="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-2">Step 03</div>
            <h3 class="text-xl font-bold text-white mb-3">Connect & Close</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Investors signal interest. Founders see validated traction. Deals happen faster than ever.</p>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="relative py-24 px-4 max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Platform Features</p>
          <h2 class="text-4xl font-extrabold text-white">Built for serious builders</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let feature of features" class="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all">
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
            <p class="text-gray-400 mb-8">Join thousands of founders who've already found their investors on FounderHub.</p>
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
    features = [
        { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered filters connect you with investors who actually care about your vertical.' },
        { icon: '🔒', title: 'Role-Based Access', desc: 'Founders post, investors discover. Clean, purpose-built experience for each role.' },
        { icon: '📊', title: 'Real-Time Interest', desc: 'See who is interested, who said maybe, and who passed — instantly.' },
        { icon: '🏷️', title: 'Structured Pitches', desc: 'No fluff. Our pitch format ensures every idea is clear, comparable, and compelling.' },
        { icon: '🔄', title: 'Rejection Resilience', desc: 'VC-rejected ideas get a second chance. Track what changed and why it matters now.' },
        { icon: '⚡', title: 'Rapid Response', desc: 'Average investor response time under 48 hours. No more months of waiting.' },
    ];
}
