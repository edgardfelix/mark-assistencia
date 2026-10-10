import { existsSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import babel, { defineRolldownBabelPreset } from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { securityHeaders, toHeadersFile } from './config/security-headers.ts';

/**
 * styled-components derives component IDs from a global creation counter.
 * Pages are code-split, so server and browser would create components in a
 * different order and hydration would mismatch. The Babel plugin assigns
 * stable, file-based IDs. It only runs on files that import styled-components.
 */
const styledComponentsPreset = (isProduction: boolean) =>
  defineRolldownBabelPreset({
    preset: () => ({
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            ssr: true,
            displayName: !isProduction,
            fileName: !isProduction,
            pure: true,
            minify: true,
            transpileTemplateLiterals: true,
            namespace: 'mk',
          },
        ],
      ],
    }),
    rolldown: { filter: { code: /from ['"]styled-components['"]/ } },
  });

/** Emits `_headers` (Netlify / Cloudflare Pages) from the shared header config. */
function securityHeadersFile(): Plugin {
  return {
    name: 'mark:security-headers-file',
    apply: 'build',
    generateBundle() {
      if (this.environment.name !== 'client') return;
      this.emitFile({ type: 'asset', fileName: '_headers', source: toHeadersFile() });
    },
  };
}

/**
 * `vite preview` only: unknown page URLs get 404.html with a 404 status, as on
 * Vercel/Netlify, instead of the default SPA fallback to index.html.
 */
function previewNotFound(): Plugin {
  return {
    name: 'mark:preview-not-found',
    configurePreviewServer(server) {
      const outDir = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        if (req.method !== 'GET' || pathname === '/' || extname(pathname)) {
          next();
          return;
        }
        const notFound = join(outDir, '404.html');
        if (existsSync(join(outDir, `${pathname.replace(/\/$/, '')}.html`)) || !existsSync(notFound)) {
          next();
          return;
        }
        res.statusCode = 404;
        for (const [name, value] of Object.entries(securityHeaders)) res.setHeader(name, value);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(notFound));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [
      react(),
      babel({ presets: [styledComponentsPreset(isProduction)] }),
      securityHeadersFile(),
      previewNotFound(),
    ],
    resolve: { tsconfigPaths: true },
    ssr: {
      // No package exports map: Node would load its CommonJS build, whose default
      // import is the exports object. Bundling it resolves the server ESM build.
      noExternal: ['styled-components'],
    },
    build: {
      // Never inline assets as data: URIs, so the CSP can keep `img-src 'self'`.
      assetsInlineLimit: 0,
      manifest: true,
      sourcemap: false,
      rolldownOptions: {
        output: {
          // Stable vendors in their own long-cached chunks: a content deploy does
          // not invalidate them. Motion is left out so its lazily loaded feature
          // bundle is never pulled into an eager chunk.
          codeSplitting: {
            groups: [
              { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'vendor-router', test: /node_modules[\\/]react-router[\\/]/ },
            ],
          },
        },
      },
    },
    preview: {
      headers: securityHeaders,
    },
  };
});
