import { registerAnalyticsSink } from '@/lib/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type Gtag = (...args: unknown[]) => void;

/**
 * Google Analytics 4 (gtag.js). Google's snippet is an inline script, which the
 * CSP forbids, so the same setup runs from this bundle and gtag.js is the only
 * third-party script. Commands queue in `dataLayer` until gtag.js arrives,
 * after the page has loaded and gone idle (the script is ~450 KB and must not
 * compete with first-load resources).
 *
 * Page views: the landing one is sent with the URL and title read at startup,
 * because gtag.js may only run after a quick navigation. Navigations before
 * gtag.js runs are counted here; after that, GA4 enhanced measurement counts
 * them (browser history events). `titleFor` maps a pathname to its page title.
 */
export function startGoogleAnalytics(measurementId: string, titleFor: (pathname: string) => string): void {
  const dataLayer = (window.dataLayer ??= []);
  const gtag: Gtag = function () {
    // gtag.js only recognizes commands pushed as Arguments objects, not arrays.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  // Like enhanced measurement, an in-site navigation names the previous page as referrer.
  const pageView = (previousUrl?: string) => {
    gtag('event', 'page_view', {
      page_location: location.href,
      page_title: document.title,
      ...(previousUrl ? { page_referrer: previousUrl } : {}),
    });
  };
  let gtagRunning = false;

  gtag('js', new Date());
  // Without advertising features, as the privacy policy states.
  gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  pageView();
  registerAnalyticsSink(({ name, ...params }) => {
    gtag('event', name, params);
  });
  watchNavigation(titleFor, (previousUrl) => {
    if (!gtagRunning) pageView(previousUrl);
  });

  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.addEventListener(
      'load',
      () => {
        gtagRunning = true;
      },
      { once: true },
    );
    document.head.append(script);
  };
  // Safari has no requestIdleCallback: the next frame after `load` is a fine fallback.
  const whenIdle = () => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(load, { timeout: 2000 });
    else requestAnimationFrame(load);
  };
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}

const withoutHash = (href: string) => href.split('#', 1)[0] ?? href;

/**
 * Keeps document.title ahead of the URL and reports URL changes. Enhanced
 * measurement takes document.title the moment the History API changes the URL,
 * before React renders the new page: measured with a real GA4 tag, client-side
 * navigations were reported with the previous page's title. So the destination's
 * title is set first; RootLayout then applies the same head tags. The popstate
 * listener is registered before the router's and gtag.js's.
 */
function watchNavigation(titleFor: (pathname: string) => string, onUrlChange: (previousUrl: string) => void): void {
  let lastUrl = withoutHash(location.href);
  const reportChange = () => {
    const url = withoutHash(location.href);
    if (url === lastUrl) return;
    const previousUrl = lastUrl;
    lastUrl = url;
    onUrlChange(previousUrl);
  };
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method].bind(history);
    history[method] = (data: unknown, unused: string, url?: string | URL | null) => {
      if (url != null) document.title = titleFor(new URL(url, location.href).pathname);
      original(data, unused, url);
      reportChange();
    };
  }
  window.addEventListener('popstate', () => {
    document.title = titleFor(location.pathname);
    reportChange();
  });
}
