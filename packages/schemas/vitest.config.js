import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '/runtime/v0.0.1': path.resolve(import.meta.dirname, '../../runtime/v0.0.1/dist')
    },
    coverage: {
      include: ['src/**/*'],
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    watch: false
  }
});
