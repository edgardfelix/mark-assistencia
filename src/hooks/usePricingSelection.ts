import { useSearchParams } from 'react-router';
import { pricingQueryParam, resolvePricingOption, type PricingOption } from '@/data/pricing';
import { useIsClient } from './useClientEnvironment';

/**
 * The option chosen on the prices page, read from `?servico=`.
 *
 * The URL is the only source of truth: links are shareable and survive a
 * refresh, Back/Forward restore the right state, and removing the query removes
 * the selection (nothing stale is kept in memory). The value is untrusted and
 * only resolves when it matches a known option id.
 *
 * Pages are prerendered without a query string, so the server render and the
 * hydration render show no selection; it appears right after hydration. On
 * client-side navigation (the normal flow from /precos) it renders immediately.
 */
export function usePricingSelection(): PricingOption | null {
  const [params] = useSearchParams();
  const isClient = useIsClient();
  return isClient ? resolvePricingOption(params.get(pricingQueryParam)) : null;
}
