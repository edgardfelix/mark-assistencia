/**
 * Analytics seam. Nothing is tracked today: no analytics or ad pixels are
 * installed. Conversion events are already emitted at the right places, so a
 * future provider (e.g. an ads conversion tag, added together with a consent
 * banner and an updated privacy policy) only needs `registerAnalyticsSink`.
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
