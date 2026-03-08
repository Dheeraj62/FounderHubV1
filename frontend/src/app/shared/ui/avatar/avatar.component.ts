import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [className]="avatarClasses">
      <img *ngIf="src" [src]="src" [alt]="alt" class="h-full w-full object-cover" />
      <span *ngIf="!src" class="font-black text-current uppercase">
        {{ initials || (alt ? alt.charAt(0) : '?') }}
      </span>
      <span 
        *ngIf="online" 
        class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
        [class.h-2]="size === 'sm'"
        [class.w-2]="size === 'sm'"
      ></span>
    </div>
  `,
    styles: []
})
export class AvatarComponent {
    @Input() src?: string;
    @Input() alt: string = '';
    @Input() initials?: string;
    @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() variant: 'circle' | 'squircle' = 'squircle';
    @Input() online = false;
    @Input() color: 'indigo' | 'primary' | 'neutral' | 'emerald' = 'primary';

    get avatarClasses(): string {
        const base = 'relative flex shrink-0 items-center justify-center overflow-hidden border border-black/5 shadow-sm';

        const sizes = {
            xs: 'h-6 w-6 text-[10px]',
            sm: 'h-8 w-8 text-xs',
            md: 'h-10 w-10 text-sm',
            lg: 'h-12 w-12 text-base',
            xl: 'h-16 w-16 text-xl'
        };

        const variants = {
            circle: 'rounded-full',
            squircle: 'rounded-2xl'
        };

        const colors = {
            indigo: 'bg-indigo-50 text-indigo-600',
            primary: 'bg-primary-50 text-primary-600',
            neutral: 'bg-neutral-100 text-neutral-600',
            emerald: 'bg-emerald-50 text-emerald-600',
        };

        return `${base} ${sizes[this.size]} ${variants[this.variant]} ${colors[this.color]}`;
    }
}
