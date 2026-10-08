/**
 * Static prerender (runs after `build:client` and `build:server`).
 *
 * For every route: renders the React tree to HTML, injects route-specific head
 * tags, styles and module preloads into the client template, and writes a flat
 * file (`/servicos` → `servicos.html`), which Vercel (cleanUrls), Netlify and
 * Cloudflare Pages serve without redirects. Also writes 404.html, sitemap.xml
 * and robots.txt, then checks that no inline script slipped into the output.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

process.env.NODE_ENV ??= 'production';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT = join(ROOT, 'dist', 'client');
const SERVER_ENTRY = join(ROOT, 'dist', 'server', 'entry-server.js');
const MANIFEST = join(CLIENT, '.vite', 'manifest.json');

/** Route → page module, used to preload each page's code chunk. */
const PAGE_MODULES = {
  '/': 'src/pages/HomePage.tsx',
  '/servicos': 'src/pages/ServicesPage.tsx',
  '/precos': 'src/pages/PricingPage.tsx',
  '/produtos': 'src/pages/ProductsPage.tsx',
  '/empresa': 'src/pages/CompanyPage.tsx',
  '/avaliacoes': 'src/pages/ReviewsPage.tsx',
  '/contato': 'src/pages/ContactPage.tsx',
  '/privacidade': 'src/pages/PrivacyPage.tsx',
  '/termos': 'src/pages/TermsPage.tsx',
  '/404': 'src/pages/NotFoundPage.tsx',
};

const fail = (message) => {
  console.error(`[prerender] ${message}`);
  process.exit(1);
};

if (!existsSync(SERVER_ENTRY) || !existsSync(MANIFEST))
  fail('missing build output — run build:client and build:server first.');

const template = readFileSync(join(CLIENT, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->'))
  fail('dist/client/index.html was already prerendered — run build:client again.');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const { render, prerenderPaths, siteUrl } = await import(pathToFileURL(SERVER_ENTRY).href);

/** Collects a chunk and its static imports (transitively) for modulepreload. */
function chunkFiles(key, seen = new Set()) {
  const chunk = manifest[key];
  if (!chunk || seen.has(key)) return [];
  seen.add(key);
  return [chunk.file, ...(chunk.imports ?? []).flatMap((dep) => chunkFiles(dep, seen))];
}

const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
const entryFiles = new Set(chunkFiles(entryKey));

function preloadsFor(path) {
  const key = PAGE_MODULES[path];
  if (!manifest[key]) fail(`page module ${key} not found in the Vite manifest.`);
  return chunkFiles(key)
    .filter((file) => !entryFiles.has(file))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`)
    .join('\n    ');
}

const outputFile = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

async function renderPage(path) {
  const rendered = await render(path);
  // React hoists resource hints (image preloads) to the start of the rendered
  // markup; they belong in <head>, where the browser discovers them first.
  const hints = rendered.html.match(/^(?:<link [^>]*\/>)+/)?.[0] ?? '';
  const html = rendered.html.slice(hints.length);
  const head = [rendered.head, hints, preloadsFor(path)].filter(Boolean).join('\n    ');
  // Function replacers: rendered markup may legitimately contain "$" sequences.
  // `data-route` lets the client hydrate only when the URL maps to the same route
  // (protects against hosts that serve index.html for every path).
  const document = template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, () => head)
    .replace('<div id="root"><!--app-html-->', () => `<div id="root" data-route="${path}">${html}`);
  if (document.includes('<!--app-')) fail(`placeholders left unreplaced in ${path}.`);
  return document;
}

const written = [];
for (const path of prerenderPaths) {
  const file = outputFile(path);
  writeFileSync(join(CLIENT, file), await renderPage(path));
  written.push(file);
}
writeFileSync(join(CLIENT, '404.html'), await renderPage('/404'));
written.push('404.html');

// Search engine files. Absolute URLs are required, so they need the public origin.
if (siteUrl) {
  const urls = prerenderPaths
    .map((path) => `  <url><loc>${siteUrl}${path === '/' ? '/' : path}</loc></url>`)
    .join('\n');
  writeFileSync(
    join(CLIENT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(join(CLIENT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
} else {
  writeFileSync(join(CLIENT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  console.warn(
    '[prerender] VITE_SITE_URL is not set: canonical, og:url, og:image and sitemap.xml were omitted. Set it before publishing.',
  );
}

// The CSP forbids inline scripts: make sure none were produced (JSON-LD data blocks are allowed).
for (const file of written) {
  const html = readFileSync(join(CLIENT, file), 'utf8');
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)].filter(
    ([, attrs]) => !attrs.includes('application/ld+json'),
  );
  if (inline.length > 0) fail(`inline <script> found in ${file}.`);
}

// The manifest is a build artifact, not something to publish.
rmSync(join(CLIENT, '.vite'), { recursive: true, force: true });

console.log(`[prerender] ${written.length} pages written${siteUrl ? ` for ${siteUrl}` : ''}: ${written.join(', ')}`);
