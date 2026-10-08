import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    // Pure logic runs in Node; component tests opt into jsdom with a docblock.
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'config/**/*.test.ts'],
    css: false,
    restoreMocks: true,
    // Page-level tests import a whole page on their first run; slow machines need more than 5 s.
    testTimeout: 20_000,
  },
});
