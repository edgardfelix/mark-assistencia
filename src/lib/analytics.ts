/**
 * Analytics seam. Conversion events are emitted at the right places and reach
 * Google Analytics 4 when VITE_GA_ID is set (lib/google-analytics.ts); without
 * it nothing is tracked. Another provider only needs `registerAnalyticsSink`,
 * plus an updated privacy policy (and, for an ads conversion tag, a consent banner).
 */
export type AnalyticsEvent =
  | { name: 'whatsapp_click'; placement: string }
  | { name: 'phone_click'; placement: string }
  | { name: 'email_click'; placement: string }
  | { name: 'directions_click'; placement: string; provider: 'google-maps' | 'waze' }
  | { name: 'instagram_click'; placement: string }
  | { name: 'contact_form_compose'; channel: 'whatsapp' | 'email' }
  | { name: 'pricing_select'; option: string; placement: string }
  | { name: 'product_view'; product: string };

type Sink = (event: AnalyticsEvent) => void;

const sinks = new Set<Sink>();

export function registerAnalyticsSink(sink: Sink): () => void {
  sinks.add(sink);
  return () => sinks.delete(sink);
}

export function track(event: AnalyticsEvent): void {
  for (const sink of sinks) {
    try {
      sink(event);
    } catch (error) {
      console.error('[analytics] sink failed', error);
    }
  }
}
