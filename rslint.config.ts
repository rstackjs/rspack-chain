import { defineConfig, globals, js, ts } from '@rslint/core';

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
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.rstest,
      },
    },
  },
  {
    files: ['types/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  },
]);
