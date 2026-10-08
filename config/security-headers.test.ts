import { describe, expect, it } from 'vitest';
import vercel from '../vercel.json';
import { immutableAssetHeaders, securityHeaders, toHeadersFile } from './security-headers';

const csp = securityHeaders['Content-Security-Policy'] ?? '';
const directive = (name: string) => csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? '';

describe('security headers', () => {
  it('keeps scripts strict: own origin only, no inline code, no eval', () => {
    expect(directive('script-src')).toBe("script-src 'self'");
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it('does not allow data: or third-party origins', () => {
    expect(csp).not.toContain('data:');
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it('keeps vercel.json in sync with the single source of truth', () => {
    const toRecord = (list: readonly { key: string; value: string }[]) =>
      Object.fromEntries(list.map(({ key, value }) => [key, value]));
    const all = vercel.headers.find((h) => h.source === '/(.*)');
    const assets = vercel.headers.find((h) => h.source === '/assets/(.*)');
    expect(toRecord(all?.headers ?? [])).toEqual(securityHeaders);
    expect(toRecord(assets?.headers ?? [])).toEqual(immutableAssetHeaders);
  });

  it('serializes the Netlify / Cloudflare Pages _headers file', () => {
    const file = toHeadersFile();
    expect(file.startsWith('/*\n')).toBe(true);
    expect(file).toContain(`  Content-Security-Policy: ${csp}`);
    expect(file).toContain('/assets/*\n  Cache-Control: public, max-age=31536000, immutable');
  });
});
