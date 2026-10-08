import { type PageSeo } from '@/config/seo';
import { site } from '@/config/site';

/**
 * Route-level <head> tags, built from the same data for the static prerender
 * (serialized into HTML) and for client-side navigation (applied to the DOM).
 * Every managed element carries `data-head` so it can be replaced as a set.
 */
export type HeadTag =
  | { tag: 'title'; text: string }
  | { tag: 'meta'; attrs: Readonly<Record<string, string>> }
  | { tag: 'link'; attrs: Readonly<Record<string, string>> };

export function absoluteUrl(siteUrl: string, path: string): string {
  return siteUrl ? `${siteUrl}${path === '/' ? '/' : path}` : '';
}

export function buildHeadTags(seo: PageSeo, siteUrl: string): HeadTag[] {
  const url = absoluteUrl(siteUrl, seo.path);
  const image = siteUrl ? `${siteUrl}${site.ogImage.path}` : '';
  const meta = (attrs: Record<string, string>): HeadTag => ({ tag: 'meta', attrs });

  const tags: HeadTag[] = [
    { tag: 'title', text: seo.title },
    meta({ name: 'description', content: seo.description }),
    meta({ name: 'robots', content: seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' }),
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:locale', content: site.locale }),
    meta({ property: 'og:site_name', content: site.name }),
    meta({ property: 'og:title', content: seo.title }),
    meta({ property: 'og:description', content: seo.description }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: seo.title }),
    meta({ name: 'twitter:description', content: seo.description }),
  ];

  if (url && !seo.noindex) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } }, meta({ property: 'og:url', content: url }));
  }
  if (image) {
    tags.push(
      meta({ property: 'og:image', content: image }),
      meta({ property: 'og:image:type', content: site.ogImage.type }),
      meta({ property: 'og:image:width', content: String(site.ogImage.width) }),
      meta({ property: 'og:image:height', content: String(site.ogImage.height) }),
      meta({ property: 'og:image:alt', content: site.ogImage.alt }),
      meta({ name: 'twitter:image', content: image }),
    );
  }
  return tags;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Server: serialize tags to HTML. */
export function serializeHeadTags(tags: readonly HeadTag[]): string {
  return tags
    .map((t) => {
      if (t.tag === 'title') return `<title>${escapeHtml(t.text)}</title>`;
      const attrs = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
        .join(' ');
      return `<${t.tag} data-head ${attrs}>`;
    })
    .join('\n    ');
}

/** Client: replace the managed tags after a navigation. */
export function applyHeadTags(tags: readonly HeadTag[]): void {
  const head = document.head;
  head.querySelectorAll('[data-head]').forEach((el) => {
    el.remove();
  });
  const fragment = document.createDocumentFragment();
  for (const t of tags) {
    if (t.tag === 'title') {
      document.title = t.text;
      continue;
    }
    const el = document.createElement(t.tag);
    el.setAttribute('data-head', '');
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    fragment.appendChild(el);
  }
  head.appendChild(fragment);
}
