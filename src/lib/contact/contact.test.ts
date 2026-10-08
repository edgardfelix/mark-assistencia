import { describe, expect, it } from 'vitest';
import { buildContactUrl, composeContactMessage } from './compose';
import { sanitizeLine, sanitizeMultiline } from './sanitize';
import { contactSchema } from './schema';

// Invisible characters are built from code points so they never sit literally in the source.
const ZWSP = String.fromCodePoint(0x200b); // zero-width space
const RLO = String.fromCodePoint(0x202e); // right-to-left override (text spoofing)
const BOM = String.fromCodePoint(0xfeff); // byte order mark

const valid = {
  name: '  Ana   Souza ',
  device: 'iPhone 13',
  subject: 'Troca de tela',
  message: 'A tela trincou depois de uma queda.',
};

describe('sanitize', () => {
  it('removes control, zero-width and bidi-override characters', () => {
    expect(sanitizeLine(`A\u0000n${ZWSP}a${RLO} \u0007Souza`)).toBe('Ana Souza');
    expect(sanitizeLine(`${BOM}  Ana\t\tSouza  `)).toBe('Ana Souza');
  });

  it('keeps line breaks in messages but normalizes them', () => {
    expect(sanitizeMultiline('Linha 1\r\n\r\n\r\n\r\nLinha 2   \n  com   espaços')).toBe(
      'Linha 1\n\nLinha 2\n com espaços',
    );
  });
});

describe('contact schema', () => {
  it('accepts and sanitizes a valid message', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Ana Souza');
  });

  it('returns Brazilian Portuguese errors for missing fields', () => {
    const result = contactSchema.safeParse({ name: '', device: '', message: '' });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message) ?? [];
    expect(messages).toContain('Informe seu nome.');
    expect(messages).toContain('Escolha um assunto.');
    expect(messages).toContain('Escreva sua mensagem.');
  });

  it('enforces length limits after sanitization', () => {
    const tooShort = contactSchema.safeParse({ ...valid, message: '   curta  ' });
    expect(tooShort.error?.issues[0]?.message).toBe('Conte um pouco mais (mínimo de 10 caracteres).');
    const tooLong = contactSchema.safeParse({ ...valid, message: 'a'.repeat(601) });
    expect(tooLong.error?.issues[0]?.message).toBe('Use no máximo 600 caracteres.');
    const invisibleName = contactSchema.safeParse({ ...valid, name: `${ZWSP}${ZWSP}` });
    expect(invisibleName.success).toBe(false);
  });

  it('rejects subjects outside the list', () => {
    expect(contactSchema.safeParse({ ...valid, subject: 'Desbloqueio' }).success).toBe(false);
  });
});

describe('message composition', () => {
  const data = contactSchema.parse(valid);

  it('composes a structured, readable message', () => {
    expect(composeContactMessage(data)).toBe(
      'Olá! Vim pelo site da MARK ASSISTÊNCIA.\n\nNome: Ana Souza\nAparelho: iPhone 13\nAssunto: Troca de tela\n\nA tela trincou depois de uma queda.',
    );
  });

  it('omits the device line when it is empty', () => {
    expect(composeContactMessage({ ...data, device: '' })).not.toContain('Aparelho:');
  });

  it('targets WhatsApp or e-mail with the same content', () => {
    const whatsapp = new URL(buildContactUrl('whatsapp', data));
    expect(whatsapp.hostname).toBe('wa.me');
    expect(whatsapp.searchParams.get('text')).toContain('Nome: Ana Souza');
    expect(buildContactUrl('email', data)).toMatch(/^mailto:paulo\.marcel2@gmail\.com\?subject=/);
  });

  it('opens with the option chosen on the prices page', () => {
    const context = {
      opening: 'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre o atendimento para iPhone.',
      topic: 'iPhone',
    };
    expect(composeContactMessage(data, context)).toBe(
      'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre o atendimento para iPhone.\n\nNome: Ana Souza\nAparelho: iPhone 13\nAssunto: Troca de tela\n\nA tela trincou depois de uma queda.',
    );
    const email = new URL(buildContactUrl('email', data, context).replace('mailto:', 'mailto://'));
    expect(email.searchParams.get('subject')).toBe('Contato pelo site — iPhone · Troca de tela');
  });
});
