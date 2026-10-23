/**
 * Google Analytics 4 measurement ID, read from VITE_GA_ID at build time.
 * Without a valid ID nothing is loaded and the privacy policy keeps saying the
 * site has no analytics. With one, gtag.js loads after the page
 * (lib/google-analytics.ts) and the privacy policy describes it (content/legal.ts).
 */
export function normalizeGaId(value: string | undefined): string {
  const id = value?.trim().toUpperCase() ?? '';
  return /^G-[A-Z0-9]+$/.test(id) ? id : '';
}

export const gaMeasurementId = normalizeGaId(import.meta.env.VITE_GA_ID);
