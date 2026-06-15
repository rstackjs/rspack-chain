import { RspackChain } from '../src/index';

test('extends', () => {
  const config = new RspackChain();

  expect(config.extends('./rspack.base.js')).toBe(config);
  expect(config.toConfig()).toStrictEqual({
    extends: './rspack.base.js',
  });
});

test('incremental', () => {
  const config = new RspackChain();

  expect(config.incremental('safe')).toBe(config);
  expect(config.toConfig()).toStrictEqual({
    incremental: 'safe',
  });
});
