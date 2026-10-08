import { type ImageId } from '@/lib/media';

/**
 * Largest above-the-fold image of each page (its LCP candidate). Used by the
 * component that renders it AND by the prerender, which emits a matching
 * high-priority preload. Sharing the `sizes` string guarantees the preload and
 * the <picture> pick the same file (no double download).
 */
export interface LcpImage {
  id: ImageId;
  sizes: string;
}

export const lcpImages = {
  home: { id: 'hero-poster', sizes: '(min-width: 1024px) 380px, 100vw' },
  services: { id: 'bench-iphone', sizes: '(min-width: 1024px) 440px, 60vw' },
  company: { id: 'store-interior', sizes: '(min-width: 1024px) 460px, 60vw' },
} as const satisfies Record<string, LcpImage>;
