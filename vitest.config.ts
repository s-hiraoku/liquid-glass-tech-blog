import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom/vitest'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 95,
        statements: 95,
      },
      include: [
        'src/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/tests/**',
        'src/**/*.d.ts',
        'src/**/*.config.{ts,tsx}',
        'node_modules/**',
      ],
    },
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/types': resolve(__dirname, './src/types'),
      '@/tests': resolve(__dirname, './src/tests'),
    },
  },
});