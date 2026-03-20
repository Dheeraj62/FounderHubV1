import { Injectable, signal } from '@angular/core';
import { Toast, ToastType, ConfirmConfig, ConfirmState } from './toast.models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  confirmState = signal<ConfirmState>({ isOpen: false, config: null, resolve: null });

  requestConfirmation(config: ConfirmConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmState.set({
        isOpen: true,
        config: { confirmText: 'Confirm', cancelText: 'Cancel', danger: false, ...config },
        resolve
      });
    });
  }

  respondToConfirmation(result: boolean) {
    const state = this.confirmState();
    if (state.resolve) state.resolve(result);
    this.confirmState.set({ isOpen: false, config: null, resolve: null });
  }

  show(message: string, type: ToastType = 'info', durationMs: number = 5000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type };
    this.toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(message: string, durationMs = 5000) {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs = 6000) {
    this.show(message, 'error', durationMs);
  }

  warning(message: string, durationMs = 5000) {
    this.show(message, 'warning', durationMs);
  }

  info(message: string, durationMs = 5000) {
    this.show(message, 'info', durationMs);
  }

  remove(id: string) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
