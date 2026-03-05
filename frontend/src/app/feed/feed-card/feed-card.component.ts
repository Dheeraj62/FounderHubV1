import { Component, Input, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeedItem } from '../../core/models/feed.models';
import { AuthService } from '../../core/services/auth.service';
import { InterestService } from '../../core/services/interest.service';
import { FollowService } from '../../core/services/follow.service';
import { FollowType } from '../../core/models/follow.models';

@Component({
  selector: 'app-feed-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app-card p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-base">{{ icon }}</span>
            <span class="font-semibold text-gray-900">@{{ item.actor.username }}</span>
            <span *ngIf="item.actor.linkedInVerified" class="app-badge app-badge-verified">LinkedIn Verified</span>
            <span class="text-gray-400">·</span>
            <span class="text-gray-500">{{ item.createdAt | date:'short' }}</span>
          </div>

          <div class="mt-2">
            <div class="text-base font-semibold text-gray-900" *ngIf="headline">{{ headline }}</div>
            <div *ngIf="subline" class="mt-1 text-sm text-gray-600">{{ subline }}</div>
          </div>
        </div>

        <button
          *ngIf="followable && item.idea"
          type="button"
          class="app-btn-secondary"
          (click)="toggleFollow(item.idea.id, 'IDEA')"
        >
          {{ isFollowed() ? 'Following' : 'Follow' }}
        </button>
      </div>

      <div *ngIf="item.update" class="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 whitespace-pre-wrap">
        {{ item.update.content }}
      </div>

      <div *ngIf="item.idea" class="mt-4 rounded-xl border border-gray-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs text-gray-500">{{ item.idea.industry }} • {{ item.idea.stage }}</div>
            <div class="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{{ item.idea.title }}</div>
            <div class="mt-1 text-xs text-gray-500">Founder: @{{ item.idea.founderUsername }}</div>
          </div>
          <span *ngIf="item.idea.previouslyRejected" class="app-badge app-badge-warn">Second chance</span>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <a *ngIf="item.idea" [routerLink]="['/idea', item.idea.id]" class="app-btn-secondary">
            View Idea
          </a>

          <ng-container *ngIf="isInvestor && !isMineIdea">
            <button type="button" class="app-btn-primary" (click)="express(item.idea.id, 'Interested')">
              Interested
            </button>
            <button type="button" class="app-btn-secondary" (click)="express(item.idea.id, 'Maybe')">
              Maybe
            </button>
          </ng-container>

          <span *ngIf="item.type === 'INTEREST_EVENT' && item.interestStatus" class="text-xs text-gray-500 ml-auto">
            Interest: <span class="font-semibold text-gray-700">{{ item.interestStatus }}</span>
          </span>
        </div>
      </div>
    </div>
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

