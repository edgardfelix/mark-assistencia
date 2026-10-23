/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public production origin, e.g. https://www.example.com.br (resolved in vite.config.ts). */
  readonly VITE_SITE_URL?: string;
  /** Google Analytics 4 measurement ID (G-XXXXXXXXXX); analytics is off when empty (see config/analytics.ts). */
  readonly VITE_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
