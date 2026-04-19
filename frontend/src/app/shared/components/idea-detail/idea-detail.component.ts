import { Component, Input, OnInit, signal, computed, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { IdeaService } from '../../../core/services/idea.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ConnectionService } from '../../../core/services/connection.service';
import { SavedIdeaService } from '../../../core/services/saved-idea.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { InterestService } from '../../../core/services/interest.service';
import { ToastService } from '../../ui/toast/toast.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { Idea } from '../../../core/models/idea.models';
import { FounderProfile } from '../../../core/models/profile.models';
import { IdeaTimelineComponent } from '../idea-timeline/idea-timeline.component';
import { FounderSignalsComponent } from '../founder-signals/founder-signals.component';
import { FeedbackPanelComponent } from '../feedback-panel/feedback-panel.component';
import { CredibilityScoreComponent } from '../credibility-score/credibility-score.component';

@Component({
  selector: 'app-idea-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IdeaTimelineComponent, FounderSignalsComponent, FeedbackPanelComponent, CredibilityScoreComponent, ButtonComponent],
  template: `
    <div class="max-w-5xl mx-auto py-8 lg:py-12 px-4 font-sans" *ngIf="idea">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white border border-neutral-200 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <!-- Glassy background decoration -->
            <div class="absolute -top-32 -right-32 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="flex justify-between items-start mb-8 relative z-10">
              <div class="max-w-xl">
                <span class="inline-flex items-center text-primary-700 font-bold uppercase tracking-widest text-[10px] bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                  {{ idea.industry }} • {{ idea.stage }}
                </span>
                <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 leading-[1.1] tracking-tight">{{ idea.title }}</h1>
                <p class="text-neutral-500 mt-4 font-medium flex items-center">
                  <svg class="w-5 h-5 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> 
                  {{ idea.location || 'Remote / Global' }}
                </p>
              </div>
              
              <div *ngIf="isInvestor" class="flex flex-col gap-2 relative z-10">
                <div class="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border border-neutral-200 shadow-sm">
                  <button (click)="toggleWatchlist()" 
                          [class]="isWatchlisted ? 'text-primary-600 bg-primary-50' : 'text-neutral-500 hover:bg-neutral-50'"
                          class="p-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center" title="Watchlist">
                    <span class="text-xl">{{ isWatchlisted ? '👀' : '👁️' }}</span>
                  </button>
                  <button (click)="toggleSave()" 
                          [class]="isSaved ? 'text-rose-600 bg-rose-50' : 'text-neutral-500 hover:bg-neutral-50'"
                          class="p-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center" title="Save Idea">
                    <span class="text-xl">{{ isSaved ? '❤️' : '🤍' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-10 mt-12 relative z-10">
              <section>
                <h2 class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 border-b border-neutral-100 pb-3">The Problem</h2>
                <p class="text-lg text-neutral-600 leading-relaxed font-medium">{{ idea.problem }}</p>
              </section>

              <section>
                <h2 class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 border-b border-neutral-100 pb-3">The Solution</h2>
                <p class="text-lg text-neutral-600 leading-relaxed font-medium">{{ idea.solution }}</p>
              </section>

              <div class="grid grid-cols-2 gap-5 mt-10">
                <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
                  <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Funding Objective</h3>
                  <p class="text-2xl font-black text-emerald-600 tracking-tight">{{ idea.fundingRange || 'Not Specified' }}</p>
                </div>
                <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
                  <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Target Customers</h3>
                  <p class="text-2xl font-black text-primary-600 tracking-tight">{{ idea.targetCustomers || 'B2B/B2C' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
                  <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Addressable Market (TAM)</h3>
                  <p class="text-xl font-bold text-neutral-800">{{ idea.marketSize || 'Data not provided' }}</p>
                </div>
                <div class="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
                  <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Traction & Metrics</h3>
                  <p class="text-base font-semibold text-neutral-600">{{ idea.tractionMetrics || 'Pre-traction / Early Stage' }}</p>
                </div>
              </div>

              <section *ngIf="idea.pitchDeckUrl || idea.demoUrl || idea.startupWebsite" class="mt-10">
                <h2 class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 border-b border-neutral-100 pb-3">Resources & Links</h2>
                <div class="flex flex-wrap gap-3">
                  <a *ngIf="idea.pitchDeckUrl" class="px-5 py-2.5 rounded-xl bg-white text-primary-600 border border-neutral-200 text-sm font-bold hover:bg-primary-50 hover:border-primary-200 shadow-sm transition-all flex items-center gap-2"
                     [href]="idea.pitchDeckUrl" target="_blank" rel="noopener noreferrer">
                    <span class="text-lg">📄</span> Pitch Deck
                  </a>
                  <a *ngIf="idea.demoUrl" class="px-5 py-2.5 rounded-xl bg-white text-emerald-600 border border-neutral-200 text-sm font-bold hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition-all flex items-center gap-2"
                     [href]="idea.demoUrl" target="_blank" rel="noopener noreferrer">
                    <span class="text-lg">▶️</span> Demo
                  </a>
                  <a *ngIf="idea.startupWebsite" class="px-5 py-2.5 rounded-xl bg-white text-neutral-600 border border-neutral-200 text-sm font-bold hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all flex items-center gap-2"
                     [href]="idea.startupWebsite" target="_blank" rel="noopener noreferrer">
                    <span class="text-lg">🌐</span> Website
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
          <div class="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-sm">
            <h3 class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-6 flex items-center">
              <svg class="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Founder Credibility
            </h3>
            
            <div *ngIf="founderProfile" class="space-y-6">
              <div class="flex items-center gap-5 mb-8">
                <div class="w-16 h-16 rounded-[1rem] bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-sm flex items-center justify-center text-2xl font-black text-primary-600">
                  {{ founderProfile.bio.charAt(0) || 'F' }}
                </div>
                <div>
                  <h4 class="text-neutral-900 font-extrabold text-xl tracking-tight">Lead Founder</h4>
                  <p class="text-sm font-medium text-neutral-500">Member since 2024</p>
                </div>
              </div>

              <app-founder-signals [profile]="founderProfile"></app-founder-signals>
              
              <!-- Credibility Score Widget -->
              <app-credibility-score *ngIf="founderProfile && idea" [founderId]="idea.founderId"></app-credibility-score>
              
              <div class="pt-6 border-t border-neutral-100 mt-6">
                <p class="text-sm font-medium text-neutral-600 italic bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
                  "{{ founderProfile.bio }}"
                </p>
              </div>

              <!-- Action for Investor -->
              <div *ngIf="isInvestor && !isMine" class="pt-8 space-y-8">
                <div>
                  <h4 class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-4">Express Interest</h4>
                  <div class="grid grid-cols-1 gap-2.5">
                    <app-button 
                      [variant]="myInterest() === 'HighlyInterested' ? 'primary' : 'outline'" 
                      [selected]="myInterest() === 'HighlyInterested'"
                      size="sm"
                      (onClick)="expressInterest('HighlyInterested')">
                      🔥 Highly Interested
                    </app-button>
                    <app-button 
                      variant="outline" 
                      [selected]="myInterest() === 'Maybe'"
                      size="sm"
                      (onClick)="expressInterest('Maybe')">
                      🤔 Keep in Touch
                    </app-button>
                    <app-button 
                      [variant]="myInterest() === 'Pass' ? 'danger' : 'outline'" 
                      [selected]="myInterest() === 'Pass'"
                      size="sm"
                      (onClick)="expressInterest('Pass')">
                      ❌ Pass
                    </app-button>
                  </div>
                </div>

                <div class="pt-6 border-t border-neutral-100">
                  <h4 class="text-[11px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-4">Direct Connection</h4>
                  <app-button *ngIf="!connectionStatus" 
                          (onClick)="connect()"
                          variant="primary"
                          [fullWidth]="true">
                    Request Direct Connection
                  </app-button>
                  <div *ngIf="connectionStatus === 'Pending'" class="w-full bg-amber-50 text-amber-700 text-sm font-bold py-3 px-4 text-center rounded-xl border border-amber-200">
                    Connection Request Pending
                  </div>
                  <app-button *ngIf="connectionStatus === 'Accepted'" 
                          (onClick)="goToMessages()"
                          variant="primary"
                          [fullWidth]="true"
                          class="shadow-md">
                    ✉️ Message Founder
                  </app-button>
                </div>
              </div>
            </div>

            <div *ngIf="!founderProfile" class="animate-pulse space-y-5">
              <div class="h-16 bg-neutral-100 rounded-2xl w-full"></div>
              <div class="h-32 bg-neutral-100 rounded-2xl w-full"></div>
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
  private toastService = inject(ToastService);
  idea?: Idea;
  founderProfile?: FounderProfile;
  isInvestor = false;
  isMine = false;
  isSaved = false;
  isWatchlisted = false;
  connectionStatus?: string;
  activeConnectionId?: string;
  myInterest = signal<'HighlyInterested' | 'Maybe' | 'Pass' | 'Interested' | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  goToMessages() {
    if (this.activeConnectionId) {
      this.router.navigate(['/messages', this.activeConnectionId]);
    } else {
      this.toastService.error("Connection thread not found.");
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
        
        if (idea.currentUserInterest) {
          this.myInterest.set(idea.currentUserInterest as any);
        }
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
      this.activeConnectionId = conn?.id;
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
    this.connectionService.sendRequest({ founderId: this.idea.founderId }).subscribe({
      next: () => {
        this.connectionStatus = 'Pending';
        this.toastService.success('Connection request sent!');
      },
      error: (err) => {
        console.error('Failed to send connection request:', err);
        this.toastService.error('Failed to send connection request.');
      }
    });
  }

  expressInterest(status: 'HighlyInterested' | 'Maybe' | 'Pass') {
    if (!this.idea) return;
    
    // Optimistic Update
    const oldStatus = this.myInterest();
    this.myInterest.set(status);
    this.cdr.markForCheck();

    this.interestService.expressInterest(this.idea.id, { status }).subscribe({
      next: () => {
        if (status === 'HighlyInterested' && !this.connectionStatus) {
            this.connect(); // Auto-connect on high interest
        }
        this.toastService.success('Interest updated');
      },
      error: () => {
        this.myInterest.set(oldStatus);
        this.cdr.markForCheck();
        this.toastService.error('Failed to express interest.');
      }
    });
  }
}
