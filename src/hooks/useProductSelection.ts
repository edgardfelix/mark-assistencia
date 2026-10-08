import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { productQueryParam, resolveProduct, type Product } from '@/data/products';
import { track } from '@/lib/analytics';
import { useIsClient } from './useClientEnvironment';

interface SheetState {
  productSheet?: boolean;
}

const openedInApp = (state: unknown): boolean =>
  typeof state === 'object' && state !== null && (state as SheetState).productSheet === true;

/**
 * The product whose details are open, kept in the URL (`?produto=`): a link to
 * a product can be shared, survives a refresh, and the browser's Back button
 * closes the details instead of leaving the page — what people expect on a phone.
 * Unknown values are ignored. The prerendered page has no query string, so the
 * details open right after hydration (never during it).
 */
export function useProductSelection() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isClient = useIsClient();
  const selected = isClient ? resolveProduct(params.get(productQueryParam)) : null;
  const inApp = openedInApp(location.state);

  const open = useCallback(
    (product: Product) => {
      track({ name: 'product_view', product: product.id });
      void navigate(
        { search: `?${new URLSearchParams({ [productQueryParam]: product.id }).toString()}` },
        { preventScrollReset: true, state: { productSheet: true } satisfies SheetState },
      );
    },
    [navigate],
  );

  // Opened here: step back in history (Back and the close button agree).
  // Arrived through a shared link: drop the query in place instead of leaving the site.
  const close = useCallback(() => {
    if (inApp) void navigate(-1);
    else void navigate({ search: '' }, { replace: true, preventScrollReset: true });
  }, [inApp, navigate]);

  return { selected, open, close };
}
