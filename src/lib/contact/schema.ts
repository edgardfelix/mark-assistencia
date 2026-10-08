import { z } from 'zod';
import { sanitizeLine, sanitizeMultiline } from './sanitize';

// The site's CSP forbids eval. Without this, Zod probes `new Function` for its
// JIT and the browser reports a CSP violation (the probe itself is harmless).
z.config({ jitless: true });

/**
 * Contact form schema. Framework-free on purpose: a future server endpoint can
 * import and re-run the exact same validation (never trust the client alone).
 */
export const contactSubjects = [
  'Troca de tela',
  'Troca de bateria',
  'Conector de carga',
  'Outro reparo',
  'Acessórios',
  'Busca e entrega',
] as const;

export type ContactSubject = (typeof contactSubjects)[number];

export const contactLimits = {
  name: { min: 2, max: 60 },
  device: { max: 40 },
  message: { min: 10, max: 600 },
} as const;

export const contactSchema = z.object({
  name: z
    .string('Informe seu nome.')
    .transform(sanitizeLine)
    .pipe(
      z
        .string()
        .min(1, 'Informe seu nome.')
        .min(contactLimits.name.min, `O nome precisa ter pelo menos ${contactLimits.name.min} letras.`)
        .max(contactLimits.name.max, `Use no máximo ${contactLimits.name.max} caracteres.`)
        .regex(/\p{L}/u, 'Use letras no nome.'),
    ),
  device: z
    .string()
    .transform(sanitizeLine)
    .pipe(z.string().max(contactLimits.device.max, `Use no máximo ${contactLimits.device.max} caracteres.`)),
  subject: z.enum(contactSubjects, 'Escolha um assunto.'),
  message: z
    .string('Escreva sua mensagem.')
    .transform(sanitizeMultiline)
    .pipe(
      z
        .string()
        .min(1, 'Escreva sua mensagem.')
        .min(contactLimits.message.min, `Conte um pouco mais (mínimo de ${contactLimits.message.min} caracteres).`)
        .max(contactLimits.message.max, `Use no máximo ${contactLimits.message.max} caracteres.`),
    ),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormData = z.output<typeof contactSchema>;
