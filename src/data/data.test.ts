import { describe, expect, it } from 'vitest';
import manifest from '@/assets/media/manifest.json';
import { whatsappMessages } from '@/content/common';
import { feedbackQuotes, feedbackShots } from './feedback';
import { services } from './services';

describe('content integrity', () => {
  const imageIds = new Set(Object.keys(manifest.images));

  it('references only generated media', () => {
    for (const shot of feedbackShots) expect(imageIds.has(shot.id), shot.id).toBe(true);
    for (const service of services) {
      if (service.image) expect(imageIds.has(service.image.id), service.image.id).toBe(true);
      if (service.inset) expect(imageIds.has(service.inset.id), service.inset.id).toBe(true);
    }
  });

  it('shows every feedback screenshot exactly once, with alt text and caption', () => {
    expect(new Set(feedbackShots.map((s) => s.id)).size).toBe(7);
    for (const shot of feedbackShots) {
      expect(shot.alt.length).toBeGreaterThan(20);
      expect(shot.caption.length).toBeGreaterThan(5);
    }
  });

  it('ties every quote to an existing screenshot of the same source', () => {
    for (const quote of Object.values(feedbackQuotes)) {
      const shot = feedbackShots.find((s) => s.id === quote.shotId);
      expect(shot?.source).toBe(quote.source);
    }
  });

  it('lists only the services evidenced by the business material', () => {
    expect(services.map((s) => s.title)).toEqual([
      'Troca de tela',
      'Troca de bateria',
      'Conector de carga',
      'Outros reparos',
      'Acessórios',
    ]);
    for (const service of services) expect(whatsappMessages[service.whatsapp]).toMatch(/^Olá!/);
  });

  it('describes every image', () => {
    for (const service of services) {
      for (const image of [service.image, service.inset]) {
        if (image) expect(image.alt.length).toBeGreaterThan(20);
      }
    }
  });
});
