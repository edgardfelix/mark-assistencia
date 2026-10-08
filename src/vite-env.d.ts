/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public production origin, e.g. https://www.example.com.br (resolved in vite.config.ts). */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
