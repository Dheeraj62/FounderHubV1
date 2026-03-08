import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    template: `
    <div class="space-y-1.5" [class.w-full]="fullWidth">
      <label *ngIf="label" [for]="id" class="block text-sm font-semibold text-neutral-900">
        {{ label }} <span *ngIf="required" class="text-rose-500">*</span>
      </label>
      
      <div class="relative group">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 group-hover:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed"
          [class.border-rose-500]="error"
          [class.focus:ring-rose-500/10]="error"
          [class.focus:border-rose-500]="error"
        />
      </div>

      <p *ngIf="error" class="text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1">
        {{ error }}
      </p>
      <p *ngIf="helpText && !error" class="text-xs text-neutral-500">
        {{ helpText }}
      </p>
    </div>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
    @Input() label = '';
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() helpText = '';
    @Input() error = '';
    @Input() required = false;
    @Input() disabled = false;
    @Input() fullWidth = true;

    value: any = '';
    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: any): void {
        const val = event.target.value;
        this.value = val;
        this.onChange(val);
    }

    onBlur(): void {
        this.onTouched();
    }
}
