import { useCallback, useSyncExternalStore } from 'react';
import { queries } from '@/theme/media';

/**
 * Hydration-safe media query: the server snapshot (and the first client render
 * during hydration) uses `serverValue`, then React re-renders with the real value.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => {
        mql.removeEventListener('change', onChange);
      };
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const usePrefersReducedMotion = () => useMediaQuery(queries.reducedMotion);

export const useFinePointer = () => useMediaQuery(queries.finePointer);
