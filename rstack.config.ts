// Configuration guide: https://rstack.rs/config
import { define } from 'rstack';

define.lib({
  syntax: 'es2023',
});

define.test({
  include: ['./test/**/*.js'],
  globals: true,
});

define.lint(({ js, ts }) => [
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
]);

define.fmt({
  singleQuote: true,
  trailingComma: 'all',
});

define.staged({
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': ['rs lint', 'rs fmt'],
  '*.{json,md,mdx,css,scss,less,html,yml,yaml}': 'rs fmt',
});
