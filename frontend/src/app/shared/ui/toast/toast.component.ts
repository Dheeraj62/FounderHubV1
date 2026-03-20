import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Confirmation Modal Overlay -->
    <div *ngIf="toastService.confirmState().isOpen" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-0">
      <div class="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" (click)="deny()"></div>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 transform transition-all flex flex-col overflow-hidden animate-slideIn border border-neutral-100 ring-1 ring-neutral-900/5">
        <div class="p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" [ngClass]="toastService.confirmState().config?.danger ? 'bg-rose-100' : 'bg-primary-100'">
              <span *ngIf="toastService.confirmState().config?.danger" class="text-rose-600 font-bold text-xl">!</span>
              <span *ngIf="!toastService.confirmState().config?.danger" class="text-primary-600 font-bold text-xl">?</span>
            </div>
            <div class="pt-1 w-full mt-1">
              <h3 class="text-lg font-black text-neutral-900 tracking-tight leading-6">{{ toastService.confirmState().config?.title }}</h3>
              <p class="mt-3 text-sm text-neutral-500 leading-relaxed font-medium">{{ toastService.confirmState().config?.message }}</p>
            </div>
          </div>
        </div>
        <div class="bg-neutral-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-neutral-100 gap-3">
          <button type="button" (click)="confirm()" class="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-4 transition-all duration-200" [ngClass]="toastService.confirmState().config?.danger ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/30 shadow-rose-500/20' : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500/30'">
            {{ toastService.confirmState().config?.confirmText }}
          </button>
          <button type="button" (click)="deny()" class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none transition-all duration-200">
            {{ toastService.confirmState().config?.cancelText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Auto-dismissing Toasts -->
    <div class="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-premium border transition-all duration-300 w-[350px] transform origin-bottom animate-slideIn"
        [ngClass]="{
          'bg-white border-green-200': toast.type === 'success',
          'bg-rose-50 border-rose-200': toast.type === 'error',
          'bg-amber-50 border-amber-200': toast.type === 'warning',
          'bg-blue-50 border-blue-200': toast.type === 'info'
        }"
      >
        <div class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold mt-0.5"
          [ngClass]="{
            'bg-green-100 text-green-600': toast.type === 'success',
            'bg-rose-100 text-rose-600': toast.type === 'error',
            'bg-amber-100 text-amber-600': toast.type === 'warning',
            'bg-blue-100 text-blue-600': toast.type === 'info'
          }"
        >
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'warning'">!</span>
          <span *ngIf="toast.type === 'info'">i</span>
        </div>
        
        <p class="flex-1 text-sm font-medium leading-relaxed" 
           [ngClass]="{
             'text-green-800': toast.type === 'success',
             'text-rose-800': toast.type === 'error',
             'text-amber-800': toast.type === 'warning',
             'text-blue-800': toast.type === 'info'
           }">
          {{ toast.message }}
        </p>
        
        <button 
          (click)="toastService.remove(toast.id)"
          class="shrink-0 p-1 font-black text-xs opacity-50 hover:opacity-100 transition-opacity mt-0.5"
          [ngClass]="{
             'text-green-800': toast.type === 'success',
             'text-rose-800': toast.type === 'error',
             'text-amber-800': toast.type === 'warning',
             'text-blue-800': toast.type === 'info'
           }"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slideIn {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  confirm() {
    this.toastService.respondToConfirmation(true);
  }

  deny() {
    this.toastService.respondToConfirmation(false);
  }
}
