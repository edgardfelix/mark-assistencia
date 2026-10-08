/**
 * Input sanitization for free text that leaves the site (WhatsApp / e-mail).
 * React already escapes rendered text; this guards the outgoing payload:
 * control characters, zero-width characters and bidirectional overrides
 * (used for text spoofing) are removed and whitespace is normalized.
 */
function isUnsafeCodePoint(code: number): boolean {
  return (
    (code <= 0x1f && code !== 0x0a) || // C0 controls (newline is handled by the caller)
    (code >= 0x7f && code <= 0x9f) || // DEL + C1 controls
    (code >= 0x200b && code <= 0x200f) || // zero-width chars, LRM/RLM
    (code >= 0x202a && code <= 0x202e) || // bidi embeddings/overrides
    (code >= 0x2060 && code <= 0x2064) || // word joiner, invisible operators
    (code >= 0x2066 && code <= 0x2069) || // bidi isolates
    code === 0xfeff // BOM / zero-width no-break space
  );
}

function stripUnsafe(value: string): string {
  let out = '';
  for (const char of value) {
    if (!isUnsafeCodePoint(char.codePointAt(0) ?? 0)) out += char;
  }
  return out;
}

const normalizeLineBreaks = (value: string) => value.replace(/\r\n?/g, '\n').replace(/\t/g, ' ');

export function sanitizeLine(value: string): string {
  return stripUnsafe(normalizeLineBreaks(value)).replace(/\s+/g, ' ').trim();
}

export function sanitizeMultiline(value: string): string {
  return stripUnsafe(normalizeLineBreaks(value))
    .split('\n')
    .map((line) => line.replace(/ {2,}/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
