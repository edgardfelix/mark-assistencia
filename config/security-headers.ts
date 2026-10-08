/**
 * Single source of truth for HTTP security headers.
 *
 * Consumed by:
 *  - vite.config.ts → `vite preview` (so the production CSP is exercised locally)
 *  - the build → `_headers` file (Netlify / Cloudflare Pages)
 *  - vercel.json (kept in sync by config/security-headers.test.ts)
 *
 * The site ships no inline scripts, no eval and no third-party code, so
 * `script-src 'self'` holds. `style-src 'unsafe-inline'` is required by the
 * CSS-in-JS runtime (styled-components) and server-rendered style attributes.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
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
