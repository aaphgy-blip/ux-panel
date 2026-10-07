export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'order';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;
const listeners: Set<ToastListener> = new Set();

export const webAlerts = {
  subscribe(fn: ToastListener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  show(type: ToastType, title: string, message: string, duration = 4000) {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const toast: ToastMessage = { id, type, title, message, duration };
    listeners.forEach((listener) => listener(toast));

    // Try subtle mobile haptic feedback if available
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        if (type === 'error') {
          navigator.vibrate([40, 60, 40]);
        } else {
          navigator.vibrate(30);
        }
      }
    } catch {
      // Ignore vibration errors
    }
  },

  success(title: string, message: string) {
    this.show('success', title, message);
  },

  error(title: string, message: string) {
    this.show('error', title, message);
  },

  info(title: string, message: string) {
    this.show('info', title, message);
  },

  warning(title: string, message: string) {
    this.show('warning', title, message);
  },

  order(title: string, message: string) {
    this.show('order', title, message, 6000);
  },
};
