import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom lacks these browser APIs used by the UI (media queries, in-view reveals).
const isDom = typeof window !== 'undefined';

// Plain functions, not vi.fn(): `restoreMocks` would reset a mock's implementation
// after the first test, and every later media query would then return undefined.
const noop = () => undefined;

// jsdom exposes the property without implementing it, so check the type, not presence.
if (isDom && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: noop,
      removeEventListener: noop,
      addListener: noop,
      removeListener: noop,
      dispatchEvent: () => false,
    }),
  });
}

class ResizeObserverStub {
  observe = noop;
  unobserve = noop;
  disconnect = noop;
}

if (isDom && typeof window.ResizeObserver !== 'function') {
  Object.defineProperty(window, 'ResizeObserver', { writable: true, value: ResizeObserverStub });
}

// jsdom has <dialog> but not its modal API: open/close are enough for the UI logic.
if (isDom && typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
}

if (isDom && !('IntersectionObserver' in window)) {
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IntersectionObserverStub });
}
