import type Lenis from 'lenis';

/**
 * Smooth wheel scrolling (Lenis), loaded on demand and only for fine pointers
 * without reduced-motion. Discrete mouse-wheel steps otherwise make the
 * scroll-linked parallax jump. Touch scrolling always stays native.
 *
 * The animation loop runs only while Lenis is actually moving: it wakes on wheel
 * input or a programmatic scroll and sleeps afterwards, so an idle page does not
 * keep the main thread busy every frame.
 */
let instance: Lenis | null = null;
/** Bumped by every enable/disable request; only the latest request may create an instance. */
let generation = 0;
let frame = 0;
/** After sleeping, Lenis's clock must restart at the current frame or the first step would jump. */
let resync = true;

function loop(time: number) {
  const lenis = instance;
  if (!lenis) {
    frame = 0;
    return;
  }
  if (resync) {
    lenis.time = time;
    resync = false;
  }
  lenis.raf(time);
  if (lenis.isScrolling) {
    frame = requestAnimationFrame(loop);
  } else {
    frame = 0;
    resync = true;
  }
}

function wake() {
  if (instance && !frame) frame = requestAnimationFrame(loop);
}

export const smoothScroll = {
  async enable(): Promise<void> {
    if (instance) return;
    const request = ++generation;
    const { default: LenisCtor } = await import('lenis');
    if (request !== generation) return;
    instance = new LenisCtor({ autoRaf: false, lerp: 0.12, stopInertiaOnNavigate: true });
    // Registered after Lenis's own wheel listener, so Lenis has already set its target.
    window.addEventListener('wheel', wake, { passive: true });
  },
  disable(): void {
    generation++;
    window.removeEventListener('wheel', wake);
    cancelAnimationFrame(frame);
    frame = 0;
    resync = true;
    instance?.destroy();
    instance = null;
  },
  stop(): void {
    instance?.stop();
  },
  start(): void {
    instance?.start();
  },
  /** Scrolls to an element or offset, smoothly unless motion is reduced. */
  scrollTo(target: HTMLElement | number, { immediate = false, offset = 0 } = {}): void {
    if (instance) {
      instance.scrollTo(target, { immediate, offset });
      wake();
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate || reduced ? 'auto' : 'smooth' });
  },
};
