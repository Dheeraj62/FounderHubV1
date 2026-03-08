import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IdeaService } from '../../../core/services/idea.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ConnectionService } from '../../../core/services/connection.service';
import { SavedIdeaService } from '../../../core/services/saved-idea.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { InterestService } from '../../../core/services/interest.service';
import { Idea } from '../../../core/models/idea.models';
import { FounderProfile } from '../../../core/models/profile.models';
import { IdeaTimelineComponent } from '../idea-timeline/idea-timeline.component';
import { FounderSignalsComponent } from '../founder-signals/founder-signals.component';
import { FeedbackPanelComponent } from '../feedback-panel/feedback-panel.component';
import { CredibilityScoreComponent } from '../credibility-score/credibility-score.component';

@Component({
  selector: 'app-idea-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IdeaTimelineComponent, FounderSignalsComponent, FeedbackPanelComponent, CredibilityScoreComponent],
  template: `
    <div class="max-w-6xl mx-auto py-10 px-4" *ngIf="idea">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <!-- Glassy background decoration -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-start mb-6">
              <div>
                <span class="text-indigo-400 font-bold uppercase tracking-widest text-[10px] bg-indigo-500/10 px-3 py-1 rounded-full mb-3 inline-block">
                  {{ idea.industry }} • {{ idea.stage }}
                </span>
                <h1 class="text-4xl font-extrabold text-white leading-tight">{{ idea.title }}</h1>
                <p class="text-gray-400 mt-2 flex items-center">
                  <span class="mr-1">📍</span> {{ idea.location || 'Remote / Global' }}
                </p>
              </div>
              
              <div *ngIf="isInvestor" class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <button (click)="toggleWatchlist()" 
                          [class]="isWatchlisted ? 'text-primary-500 bg-primary-500/10 border-primary-500/30' : 'text-gray-400 bg-gray-800 border-gray-700'"
                          class="p-3 rounded-2xl border transition-all hover:scale-110 flex items-center justify-center" title="Watchlist">
                    <span class="text-xl">{{ isWatchlisted ? '👀' : '👁️' }}</span>
                  </button>
                  <button (click)="toggleSave()" 
                          [class]="isSaved ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-gray-400 bg-gray-800 border-gray-700'"
                          class="p-3 rounded-2xl border transition-all hover:scale-110 flex items-center justify-center" title="Save Idea">
                    <span class="text-xl">{{ isSaved ? '❤️' : '🤍' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-8 mt-10">
              <section>
                <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-gray-800 pb-2">The Problem</h2>
                <p class="text-lg text-gray-200 leading-relaxed">{{ idea.problem }}</p>
              </section>

              <section>
                <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-gray-800 pb-2">The Solution</h2>
                <p class="text-lg text-gray-200 leading-relaxed">{{ idea.solution }}</p>
              </section>

              <div class="grid grid-cols-2 gap-4 mt-8">
                <div class="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Funding Objective</h3>
                  <p class="text-xl font-bold text-emerald-400">{{ idea.fundingRange || 'Not Specified' }}</p>
                </div>
                <div class="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Target Customers</h3>
                  <p class="text-xl font-bold text-indigo-400">{{ idea.targetCustomers || 'B2B/B2C' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Total Addressable Market (TAM)</h3>
                  <p class="text-lg font-bold text-gray-200">{{ idea.marketSize || 'Data not provided' }}</p>
                </div>
                <div class="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <h3 class="text-xs font-bold text-gray-500 uppercase mb-2">Traction & Metrics</h3>
                  <p class="text-sm font-medium text-gray-300">{{ idea.tractionMetrics || 'Pre-traction / Early Stage' }}</p>
                </div>
              </div>

              <section *ngIf="idea.pitchDeckUrl || idea.demoUrl || idea.startupWebsite" class="mt-8">
                <h2 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-gray-800 pb-2">Links</h2>
                <div class="flex flex-wrap gap-3">
                  <a *ngIf="idea.pitchDeckUrl" class="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-sm font-bold hover:bg-indigo-600/30 transition"
                     [href]="idea.pitchDeckUrl" target="_blank" rel="noopener noreferrer">
                    📄 Pitch Deck
                  </a>
                  <a *ngIf="idea.demoUrl" class="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-600/30 transition"
                     [href]="idea.demoUrl" target="_blank" rel="noopener noreferrer">
                    ▶ Demo
                  </a>
                  <a *ngIf="idea.startupWebsite" class="px-4 py-2 rounded-xl bg-sky-600/20 text-sky-300 border border-sky-500/30 text-sm font-bold hover:bg-sky-600/30 transition"
                     [href]="idea.startupWebsite" target="_blank" rel="noopener noreferrer">
                    🔗 Website
                  </a>
                </div>
              </section>
            </div>
          </div>

          <!-- Evolution Timeline Component -->
          <app-idea-timeline [ideaId]="idea.id"></app-idea-timeline>

          <!-- Feedback Panel (investors can submit, founders can view) -->
          <app-feedback-panel
            [ideaId]="idea.id"
            [isInvestor]="isInvestor && !isMine"
            [isFounderOfIdea]="isMine"
          ></app-feedback-panel>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Founder Info & Signals -->
          <div class="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
              <span class="mr-2">🛡️</span> Founder Credibility
            </h3>
            
            <div *ngIf="founderProfile" class="space-y-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
                  {{ founderProfile.bio.charAt(0) || 'F' }}
                </div>
                <div>
                  <h4 class="text-white font-bold text-lg">Lead Founder</h4>
                  <p class="text-xs text-gray-500">Member since 2024</p>
                </div>
              </div>

              <app-founder-signals [profile]="founderProfile"></app-founder-signals>
              
              <!-- Credibility Score Widget -->
              <app-credibility-score *ngIf="founderProfile && idea" [founderId]="idea.founderId"></app-credibility-score>
              
              <div class="pt-4 border-t border-gray-800 mt-6">
                <p class="text-sm text-gray-300 italic">
                  "{{ founderProfile.bio }}"
                </p>
              </div>

              <!-- Action for Investor -->
              <div *ngIf="isInvestor && !isMine" class="pt-6 space-y-4">
                <button *ngIf="!connectionStatus" 
                        (click)="expressHighlyInterest()"
                        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                  🔥 Highly Interested
                </button>
                <button *ngIf="!connectionStatus" 
                        (click)="connect()"
                        class="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 rounded-2xl transition-all border border-gray-700 active:scale-95">
                  Request Direct Connection
                </button>
                <div *ngIf="connectionStatus === 'Pending'" class="w-full bg-gray-800 text-amber-400 font-bold py-4 text-center rounded-2xl border border-amber-500/20">
                  Connection Pending...
                </div>
                <button *ngIf="connectionStatus === 'Accepted'" routerLink="/messages" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl">
                  Message Founder
                </button>
              </div>
            </div>

            <div *ngIf="!founderProfile" class="animate-pulse space-y-4">
              <div class="h-10 bg-gray-800 rounded w-full"></div>
              <div class="h-20 bg-gray-800 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class IdeaDetailComponent implements OnInit {
  idea?: Idea;
  founderProfile?: FounderProfile;
  isInvestor = false;
  isMine = false;
  isSaved = false;
  isWatchlisted = false;
  connectionStatus?: string;

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService,
    private profileService: ProfileService,
    private connectionService: ConnectionService,
    private savedIdeaService: SavedIdeaService,
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private interestService: InterestService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isInvestor = this.authService.getUserRole() === 'Investor';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIdea(id);
    }
  }

  loadIdea(id: string) {
    this.ideaService.getIdeaById(id).subscribe(idea => {
      this.idea = idea;
      this.isMine = idea.founderId === this.authService.getUserId();
      this.loadFounderProfile(idea.founderId);

      if (this.isInvestor) {
        this.checkIfSaved(id);
        this.checkIfWatchlisted(id);
        this.checkConnection(idea.founderId);
      }
      this.cdr.markForCheck();
    });
  }

  loadFounderProfile(userId: string) {
    this.profileService.getFounderProfile(userId).subscribe(p => {
      this.founderProfile = p;
      this.cdr.markForCheck();
    });
  }

  checkIfSaved(ideaId: string) {
    this.savedIdeaService.getSavedIdeas().subscribe(list => {
      this.isSaved = list.some(i => i.id === ideaId);
      this.cdr.markForCheck();
    });
  }

  checkIfWatchlisted(ideaId: string) {
    this.watchlistService.getMyWatchlist().subscribe(list => {
      this.isWatchlisted = list.some(i => i.ideaId === ideaId);
      this.cdr.markForCheck();
    });
  }

  checkConnection(founderId: string) {
    this.connectionService.getMyConnections().subscribe(list => {
      const conn = list.find(c => c.founderId === founderId);
      this.connectionStatus = conn?.status;
      this.cdr.markForCheck();
    });
  }

  toggleSave() {
    if (!this.idea) return;
    if (this.isSaved) {
      this.savedIdeaService.unsaveIdea(this.idea.id).subscribe(() => { this.isSaved = false; this.cdr.markForCheck(); });
    } else {
      this.savedIdeaService.saveIdea(this.idea.id).subscribe(() => { this.isSaved = true; this.cdr.markForCheck(); });
    }
  }

  toggleWatchlist() {
    if (!this.idea) return;
    if (this.isWatchlisted) {
      this.watchlistService.removeFromWatchlist(this.idea.id).subscribe(() => { this.isWatchlisted = false; this.cdr.markForCheck(); });
    } else {
      this.watchlistService.addToWatchlist({ ideaId: this.idea.id }).subscribe(() => { this.isWatchlisted = true; this.cdr.markForCheck(); });
    }
  }

  connect() {
    if (!this.idea) return;
    this.connectionService.sendRequest({ founderId: this.idea.founderId }).subscribe(() => {
      this.connectionStatus = 'Pending';
      alert('Connection request sent!');
    });
  }

  expressHighlyInterest() {
    if (!this.idea) return;
    this.interestService.expressInterest(this.idea.id, { status: 'HighlyInterested' }).subscribe({
      next: () => {
        this.connectionStatus = 'Pending';
        alert('High interest expressed! A connection request has been sent automatically.');
      },
      error: () => alert('Failed to express interest.')
    });
  }
}
