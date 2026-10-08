import { describe, expect, it } from 'vitest';
import {
  directionsUrl,
  instagramUrl,
  isSafeContactUri,
  isSafeExternalUrl,
  mailtoUrl,
  mapsUrl,
  telUrl,
  wazeUrl,
  whatsappUrl,
} from './links';

describe('outbound links', () => {
  it('builds wa.me links with an encoded message', () => {
    expect(whatsappUrl()).toBe('https://wa.me/5511976654797');
    const url = new URL(whatsappUrl('Olá! Troca de tela & bateria?'));
    expect(url.hostname).toBe('wa.me');
    expect(url.searchParams.get('text')).toBe('Olá! Troca de tela & bateria?');
  });

  it('builds tel: and mailto: links', () => {
    expect(telUrl).toBe('tel:+5511976654797');
    expect(mailtoUrl()).toBe('mailto:paulo.marcel2@gmail.com');
    expect(mailtoUrl('Assunto com espaço', 'Linha 1\nLinha 2')).toBe(
      'mailto:paulo.marcel2@gmail.com?subject=Assunto%20com%20espa%C3%A7o&body=Linha%201%0ALinha%202',
    );
  });

  it('only allows https URLs on known hosts', () => {
    for (const url of [whatsappUrl('oi'), instagramUrl, mapsUrl, directionsUrl, wazeUrl]) {
      expect(isSafeExternalUrl(url)).toBe(true);
    }
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('http://wa.me/5511976654797')).toBe(false);
    expect(isSafeExternalUrl('https://wa.me.evil.example/x')).toBe(false);
    expect(isSafeExternalUrl('https://evil.example/?u=https://wa.me')).toBe(false);
    expect(isSafeExternalUrl('not a url')).toBe(false);
  });

  it('only allows well-formed tel: and mailto: URIs', () => {
    expect(isSafeContactUri(telUrl)).toBe(true);
    expect(isSafeContactUri(mailtoUrl('a', 'b'))).toBe(true);
    expect(isSafeContactUri('tel:javascript:alert(1)')).toBe(false);
    expect(isSafeContactUri('mailto:')).toBe(false);
  });

  it('strips the share-tracking token from the Instagram link', () => {
    expect(instagramUrl).toBe('https://www.instagram.com/mark_assistenciacel/');
  });
});
