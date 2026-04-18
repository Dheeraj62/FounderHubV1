import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FeedMode = 'global' | 'following';

@Component({
  selector: 'app-feed-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center bg-neutral-100 rounded-lg p-1 gap-1">
      <button
        type="button"
        (click)="modeChange.emit('global')"
        [class]="mode === 'global'
          ? 'px-4 py-2 text-sm font-semibold rounded-md bg-white text-primary-700 shadow-sm transition-all duration-200 cursor-pointer'
          : 'px-4 py-2 text-sm font-medium rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all duration-200 cursor-pointer'"
      >
        Global
      </button>
      <button
        type="button"
        (click)="modeChange.emit('following')"
        [class]="mode === 'following'
          ? 'px-4 py-2 text-sm font-semibold rounded-md bg-white text-primary-700 shadow-sm transition-all duration-200 cursor-pointer'
          : 'px-4 py-2 text-sm font-medium rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all duration-200 cursor-pointer'"
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

