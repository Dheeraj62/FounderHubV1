import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="bg-white border border-neutral-200 rounded-2xl transition-all duration-300 overflow-hidden"
      [class.shadow-card]="!hoverable"
      [class.hover:shadow-premium]="hoverable"
      [class.hover:border-primary-200]="hoverable"
      [class.p-0]="noPadding"
      [class.p-6]="!noPadding && padding === 'md'"
      [class.p-4]="!noPadding && padding === 'sm'"
      [class.p-8]="!noPadding && padding === 'lg'"
    >
      <div *ngIf="title" class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-neutral-900 leading-tight">{{ title }}</h3>
          <p *ngIf="subtitle" class="text-sm text-neutral-500 mt-1">{{ subtitle }}</p>
        </div>
        <ng-content select="[card-header-action]"></ng-content>
      </div>
      
      <ng-content></ng-content>
      
      <div *ngIf="hasFooter" class="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
    styles: []
})
export class CardComponent {
    @Input() title = '';
    @Input() subtitle = '';
    @Input() hoverable = false;
    @Input() noPadding = false;
    @Input() padding: 'sm' | 'md' | 'lg' = 'md';
    @Input() hasFooter = false;
}
