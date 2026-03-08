import { Component, Input, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeedItem } from '../../core/models/feed.models';
import { AuthService } from '../../core/services/auth.service';
import { InterestService } from '../../core/services/interest.service';
import { FollowService } from '../../core/services/follow.service';
import { FollowType } from '../../core/models/follow.models';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-feed-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <app-card padding="md" [hoverable]="true" class="block pb-2">
      <!-- Author & Time -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-lg shrink-0 border border-neutral-200">
            {{ icon }}
          </div>
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-neutral-900">@{{ item.actor.username }}</span>
              <span *ngIf="item.actor.linkedInVerified" class="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                Verified
              </span>
              <span class="text-neutral-400">·</span>
              <span class="text-sm font-medium text-neutral-500">{{ item.createdAt | date:'MMM d' }}</span>
            </div>
            <div class="mt-0.5">
              <span class="text-sm font-semibold text-neutral-800" *ngIf="headline">{{ headline }}</span>
              <span *ngIf="subline" class="ml-2 text-sm text-neutral-500">{{ subline }}</span>
            </div>
          </div>
        </div>

        <app-button
          *ngIf="followable && item.idea"
          variant="secondary"
          size="sm"
          (onClick)="toggleFollow(item.idea.id, 'IDEA')"
        >
          {{ isFollowed() ? 'Following' : 'Follow' }}
        </app-button>
      </div>

      <!-- Update Content -->
      <div *ngIf="item.update" class="ml-12 mt-2 mb-4">
        <p class="text-[15px] leading-relaxed text-neutral-800 whitespace-pre-wrap">{{ item.update.content }}</p>
      </div>

      <!-- Idea Snapshot (Embedded Card) -->
      <div *ngIf="item.idea" class="ml-12 mt-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors cursor-pointer" [routerLink]="['/idea', item.idea.id]">
        <div class="p-4">
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex items-center gap-2">
              <app-badge variant="indigo">{{ item.idea.industry }}</app-badge>
              <app-badge variant="neutral">{{ item.idea.stage }}</app-badge>
            </div>
            <!-- Status/Action Badge -->
            <app-badge *ngIf="item.idea.previouslyRejected" variant="error">Second chance</app-badge>
            <app-badge *ngIf="!item.idea.previouslyRejected && item.idea.stage === 'EarlyRevenue'" variant="success">Revenue generating</app-badge>
          </div>
          
          <h3 class="text-lg font-bold text-neutral-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">{{ item.idea.title }}</h3>
          
          <!-- Actions & Info -->
          <div class="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
            <div class="flex items-center gap-2">
              <ng-container *ngIf="isInvestor && !isMineIdea">
                <app-button variant="primary" size="sm" (onClick)="$event.stopPropagation(); express(item.idea.id, 'Interested')">
                  Interested
                </app-button>
                <app-button variant="secondary" size="sm" (onClick)="$event.stopPropagation(); express(item.idea.id, 'Maybe')">
                  Maybe
                </app-button>
              </ng-container>
              <app-button *ngIf="!isInvestor || isMineIdea" variant="ghost" size="sm" (onClick)="$event.stopPropagation();">
                View Details
              </app-button>
            </div>
            
            <span *ngIf="item.type === 'INTEREST_EVENT' && item.interestStatus" class="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Interest: 
              <span [class.text-primary-600]="item.interestStatus === 'HighlyInterested'" 
                    [class.text-amber-600]="item.interestStatus === 'Maybe'"
                    [class.text-rose-600]="item.interestStatus === 'Pass'"
                    class="ml-1">{{ item.interestStatus }}</span>
            </span>
          </div>
        </div>
      </div>
    </app-card>
  `,
})
export class FeedCardComponent {
  private auth = inject(AuthService);
  private interests = inject(InterestService);
  private follows = inject(FollowService);
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) item!: FeedItem;

  isInvestor = this.auth.getRole() === 'Investor';
  isMineIdea = false;

  private followed = signal(false);

  ngOnInit(): void {
    this.isInvestor = this.auth.getRole() === 'Investor';
    this.isMineIdea = !!this.item.idea && this.item.idea.founderId === this.auth.getUserId();
  }

  get icon(): string {
    switch (this.item.type) {
      case 'IDEA_CREATED':
        return '🚀';
      case 'IDEA_UPDATED':
        return '🔄';
      case 'FOUNDER_UPDATE':
        return '📝';
      case 'INTEREST_EVENT':
        return '⭐';
      case 'NEW_FOUNDER':
        return '👋';
      case 'TRENDING_IDEA':
        return '🔥';
      default:
        return '📰';
    }
  }

  get headline(): string {
    switch (this.item.type) {
      case 'IDEA_CREATED':
        return 'New startup idea';
      case 'IDEA_UPDATED':
        return 'Idea updated / pivot';
      case 'FOUNDER_UPDATE':
        return 'Founder update';
      case 'INTEREST_EVENT':
        return 'Investor interest activity';
      case 'NEW_FOUNDER':
        return 'New founder joined';
      case 'TRENDING_IDEA':
        return 'Trending idea';
      default:
        return 'Platform update';
    }
  }

  get subline(): string | null {
    if (this.item.type === 'NEW_FOUNDER') return 'Say hello and check out their ideas.';
    return null;
  }

  get followable(): boolean {
    return this.item.type === 'IDEA_CREATED' || this.item.type === 'IDEA_UPDATED' || this.item.type === 'TRENDING_IDEA';
  }

  isFollowed(): boolean {
    return this.followed();
  }

  toggleFollow(followingId: string, type: FollowType) {
    const req = { followingId, type };
    const op = this.followed() ? this.follows.unfollow(req) : this.follows.follow(req);
    op.subscribe({
      next: () => {
        this.followed.set(!this.followed());
        this.cdr.markForCheck();
      },
    });
  }

  express(ideaId: string, status: 'Interested' | 'Maybe') {
    this.interests.expressInterest(ideaId, { status }).subscribe();
  }
}

