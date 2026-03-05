import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FeedMode = 'global' | 'following';

@Component({
  selector: 'app-feed-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <button
        type="button"
        (click)="modeChange.emit('global')"
        [class]="mode === 'global' ? 'app-btn-primary' : 'app-btn-secondary'"
      >
        Global
      </button>
      <button
        type="button"
        (click)="modeChange.emit('following')"
        [class]="mode === 'following' ? 'app-btn-primary' : 'app-btn-secondary'"
      >
        Following
      </button>
    </div>
  `,
})
export class FeedFilterBarComponent {
  @Input() mode: FeedMode = 'global';
  @Output() modeChange = new EventEmitter<FeedMode>();
}

