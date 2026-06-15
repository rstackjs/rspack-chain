import { RspackChain } from '../src/index';

test('extends', () => {
  const config = new RspackChain();

  expect(config.extends('./rspack.base.js')).toBe(config);
  expect(config.toConfig()).toStrictEqual({
    extends: './rspack.base.js',
  });
});
