/**
 * Single source of truth for HTTP security headers.
 *
 * Consumed by:
 *  - vite.config.ts → `vite preview` (so the production CSP is exercised locally)
 *  - the build → `_headers` file (Netlify / Cloudflare Pages)
 *  - vercel.json (kept in sync by config/security-headers.test.ts)
 *
 * The site ships no inline scripts and no eval. The only third-party code is
 * Google Analytics 4 (gtag.js), loaded only when VITE_GA_ID is set; its hosts
 * are the ones Google lists for Analytics without Ads features
 * (https://developers.google.com/tag-platform/security/guides/csp).
 * `style-src 'unsafe-inline'` is required by the CSS-in-JS runtime
 * (styled-components) and server-rendered style attributes.
 */
const googleTag = 'https://www.googletagmanager.com';
const googleAnalytics = 'https://*.google-analytics.com';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' ${googleTag}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' ${googleTag} ${googleAnalytics}`,
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self' ${googleTag} ${googleAnalytics} https://*.google.com`,
  "manifest-src 'self'",
  "worker-src 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const permissionsPolicy = [
  'accelerometer=()',
  'browsing-topics=()',
  'camera=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  'usb=()',
].join(', ');

export const securityHeaders: Readonly<Record<string, string>> = {
  'Content-Security-Policy': contentSecurityPolicy,
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': permissionsPolicy,
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/** Hashed build assets never change content under the same URL. */
export const immutableAssetHeaders: Readonly<Record<string, string>> = {
  'Cache-Control': 'public, max-age=31536000, immutable',
};

/** Serializes the headers in the `_headers` format used by Netlify and Cloudflare Pages. */
export function toHeadersFile(): string {
  const block = (path: string, headers: Readonly<Record<string, string>>) =>
    [path, ...Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`)].join('\n');
  return `${block('/*', securityHeaders)}\n\n${block('/assets/*', immutableAssetHeaders)}\n`;
}
