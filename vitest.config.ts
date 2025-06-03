import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
    },
    setupFiles: [],
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});