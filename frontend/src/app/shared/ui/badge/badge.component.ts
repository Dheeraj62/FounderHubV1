import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span [className]="badgeClasses">
      <span *ngIf="dot" class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
      <ng-content></ng-content>
    </span>
  `,
    styles: []
})
export class BadgeComponent {
    @Input() variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'indigo' = 'neutral';
    @Input() size: 'sm' | 'md' = 'md';
    @Input() dot = false;
    @Input() outline = false;

    get badgeClasses(): string {
        const base = 'inline-flex items-center font-bold uppercase tracking-wider rounded-lg';

        const sizes = {
            sm: 'px-2 py-0.5 text-[10px]',
            md: 'px-2.5 py-1 text-xs'
        };

        const variants = {
            primary: this.outline ? 'border border-primary-200 text-primary-700 bg-primary-50/50' : 'bg-primary-100 text-primary-700',
            success: this.outline ? 'border border-emerald-200 text-emerald-700 bg-emerald-50/50' : 'bg-emerald-100 text-emerald-700',
            warning: this.outline ? 'border border-amber-200 text-amber-700 bg-amber-50/50' : 'bg-amber-100 text-amber-700',
            error: this.outline ? 'border border-rose-200 text-rose-700 bg-rose-50/50' : 'bg-rose-100 text-rose-700',
            neutral: this.outline ? 'border border-neutral-200 text-neutral-600 bg-neutral-50/50' : 'bg-neutral-100 text-neutral-600',
            indigo: this.outline ? 'border border-indigo-200 text-indigo-700 bg-indigo-50/50' : 'bg-indigo-100 text-indigo-700',
        };

        return `${base} ${sizes[this.size]} ${variants[this.variant]}`;
    }
}
