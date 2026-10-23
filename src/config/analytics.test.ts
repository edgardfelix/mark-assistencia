import { describe, expect, it, vi } from 'vitest';
import { normalizeGaId } from './analytics';

describe('Google Analytics measurement ID', () => {
  it('accepts only GA4 measurement IDs', () => {
    expect(normalizeGaId(' g-abc123xyz9 ')).toBe('G-ABC123XYZ9');
    for (const value of [undefined, '', 'G-', 'G-ABC 123', 'UA-12345678-1', 'GTM-ABC1234', 'G-ABC"><script>']) {
      expect(normalizeGaId(value), String(value)).toBe('');
    }
  });

  it('adds the Google Analytics section to the privacy policy only while analytics is on', async () => {
    const privacy = async (gaId: string) => {
      vi.stubEnv('VITE_GA_ID', gaId);
      vi.resetModules();
      const [{ privacyPolicy }, { pageSeo }] = await Promise.all([import('@/content/legal'), import('@/config/seo')]);
      const text = privacyPolicy.sections.flatMap((section) => [section.title, ...section.paragraphs]).join('\n');
      return { text, description: pageSeo.privacy.description, updatedAt: privacyPolicy.updatedAt.iso };
    };
    try {
      const off = await privacy('');
      expect(off.text).toContain('não usa cookies');
      expect(off.text).not.toContain('Google Analytics');
      expect(off.description).toContain('sem cookies');

      const on = await privacy('G-ABC123XYZ9');
      expect(on.text).not.toContain('não usa cookies');
      expect(on.text).toContain('Google Analytics 4');
      expect(on.text).toContain('_ga');
      expect(on.text).toContain('tools.google.com/dlpage/gaoptout');
      expect(on.description).toContain('Google Analytics');
      expect(on.description.length).toBeLessThanOrEqual(160);
      expect(on.updatedAt).toBe('2026-10-23');
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });
});
