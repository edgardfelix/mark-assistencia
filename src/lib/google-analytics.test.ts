// @vitest-environment jsdom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { track } from '@/lib/analytics';
import { startGoogleAnalytics } from './google-analytics';

const commands = () => (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
const gtagScript = () => document.head.querySelector<HTMLScriptElement>('script[src*="googletagmanager.com"]');
const idle: (() => void)[] = [];

beforeAll(() => {
  document.title = 'Início';
  vi.stubGlobal('requestIdleCallback', (callback: () => void) => idle.push(callback));
  startGoogleAnalytics('G-ABC123XYZ9', (pathname) => `Título de ${pathname}`);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('Google Analytics', () => {
  it('queues its setup and the landing page view at once, without advertising features', () => {
    expect(commands()).toEqual([
      ['js', expect.any(Date)],
      [
        'config',
        'G-ABC123XYZ9',
        { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false },
      ],
      ['event', 'page_view', { page_location: `${location.origin}/`, page_title: 'Início' }],
    ]);
    track({ name: 'whatsapp_click', placement: 'floating' });
    expect(commands().at(-1)).toEqual(['event', 'whatsapp_click', { placement: 'floating' }]);
  });

  it('counts navigations before gtag.js runs, with the destination title set first', async () => {
    const before = commands().length;
    history.pushState(null, '', '/servicos?x=1');
    expect(document.title).toBe('Título de /servicos');
    expect(commands().at(-1)).toEqual([
      'event',
      'page_view',
      {
        page_location: `${location.origin}/servicos?x=1`,
        page_title: 'Título de /servicos',
        page_referrer: `${location.origin}/`,
      },
    ]);
    // State-only and hash-only changes are not page views.
    history.replaceState({ idx: 1 }, '');
    history.pushState(null, '', '#faq');
    expect(commands()).toHaveLength(before + 1);

    // Back/Forward: the browser changes the URL, then fires popstate.
    const popstate = new Promise((resolve) => {
      window.addEventListener('popstate', resolve, { once: true });
    });
    history.go(-2);
    await popstate;
    expect(document.title).toBe('Título de /');
    expect(commands().at(-1)).toEqual([
      'event',
      'page_view',
      {
        page_location: `${location.origin}/`,
        page_title: 'Título de /',
        page_referrer: `${location.origin}/servicos?x=1`,
      },
    ]);
  });

  it('loads gtag.js once the loaded page is idle, then leaves page views to enhanced measurement', () => {
    expect(gtagScript()).toBeNull();
    // jsdom has normally finished loading by now; if not, fire `load` as a browser would.
    if (document.readyState !== 'complete') window.dispatchEvent(new Event('load'));
    for (const callback of idle) callback();
    const script = gtagScript();
    expect(script?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ9');
    expect(script?.async).toBe(true);

    script?.dispatchEvent(new Event('load'));
    const before = commands().length;
    history.pushState(null, '', '/precos');
    expect(document.title).toBe('Título de /precos');
    expect(commands()).toHaveLength(before);
  });
});
