import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [className]="buttonClasses"
    >
      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <ng-content *ngIf="!loading"></ng-content>
      <span *ngIf="loading">Please wait...</span>
    </button>
  `,
    styles: []
})
export class ButtonComponent {
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() fullWidth = false;

    @Output() onClick = new EventEmitter<MouseEvent>();

    get buttonClasses(): string {
        const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
            secondary: 'bg-white border border-border text-textPrimary hover:bg-neutral-50 focus:ring-neutral-400',
            outline: 'bg-transparent border border-border text-textSecondary hover:bg-neutral-50 focus:ring-neutral-400',
            ghost: 'bg-transparent text-textSecondary hover:bg-neutral-100 focus:ring-neutral-400',
            danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2 text-sm',
            lg: 'px-5 py-2.5 text-base',
            xl: 'px-6 py-3 text-lg'
        };

        return `${base} ${variants[this.variant]} ${sizes[this.size]} ${this.fullWidth ? 'w-full' : ''}`;
    }
}
