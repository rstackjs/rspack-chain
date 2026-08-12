import { defineConfig, js, ts } from '@rslint/core';

export default defineConfig([
  js.configs.recommended,
  ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['types/test/**/*.ts'],
    rules: {
      'no-empty-pattern': 'off',
    },
  },
  {
    files: ['test/**/*'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['src/Rule.js'],
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
  {
    files: ['types/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  },
]);
