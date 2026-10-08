import { type PointerEvent, useCallback, useRef } from 'react';

/**
 * Feeds the pointer position to `spotlightSurface` through CSS variables,
 * batched to one write per animation frame. No React state, no re-renders.
 */
export function useSpotlight<T extends HTMLElement>() {
  const frame = useRef(0);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== 'mouse') return;
    const el = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${String(clientX - rect.left)}px`);
      el.style.setProperty('--spot-y', `${String(clientY - rect.top)}px`);
    });
  }, []);

  return { onPointerMove };
}
