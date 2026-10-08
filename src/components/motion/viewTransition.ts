import { useIsClient } from '@/hooks/useClientEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Shared-element View Transition between a chosen price and the contact page:
 * the element that carries this name on the prices page morphs into the one
 * that carries it on the contact page. Browsers without the API (or visitors
 * who prefer reduced motion) simply get the regular page change.
 */
export const selectionTransitionName = 'mk-selecao';

/**
 * Feature check (client only: callers gate it behind `useIsClient`). The router
 * falls back on its own, but asking only when supported keeps it quiet elsewhere.
 */
export const canUseViewTransitions = (): boolean =>
  typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

let source: HTMLElement | null = null;

/** Names `element` as the source of the next transition (a name must be unique on the page). */
export function markSelectionSource(element: HTMLElement): void {
  if (source && source !== element) source.style.removeProperty('view-transition-name');
  element.style.setProperty('view-transition-name', selectionTransitionName);
  source = element;
}

/** True for a plain primary click or Enter: not a new-tab/new-window gesture. */
export function isPlainActivation(event: {
  button: number;
  metaKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
}): boolean {
  return event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}

/** True when navigation may use the shared-element transition (client, supported, motion allowed). */
export function useSelectionTransition(): boolean {
  const isClient = useIsClient();
  const reduced = usePrefersReducedMotion();
  return isClient && !reduced && canUseViewTransitions();
}
