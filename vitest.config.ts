import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    deps: {
      inline: ['@gravity-ui/uikit', '@gravity-ui/navigation', '@gravity-ui/icons'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    deps: {
      inline: ['@gravity-ui/uikit', '@gravity-ui/navigation', '@gravity-ui/icons'],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
  },
});
