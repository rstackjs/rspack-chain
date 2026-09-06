import Rule from '../src/Rule';
import Use from '../src/Use';

test('is Chainable', () => {
  const parent = { parent: true };
  const use = new Use(parent);

  expect(use.end()).toBe(parent);
});

test('shorthand methods', () => {
  const use = new Use();
  const obj = {};

  use.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    expect(use[method]('alpha')).toBe(use);
  });

  expect(use.entries()).toStrictEqual(obj);
});

test('tap', () => {
  const use = new Use();

  use.loader('babel-loader').options({ presets: ['alpha'] });

  use.tap((options) => {
    expect(options).toStrictEqual({ presets: ['alpha'] });
    return { presets: ['beta'] };
  });

  expect(use.store.get('options')).toStrictEqual({ presets: ['beta'] });
});

test('tap receives undefined before options are initialized', () => {
  const use = new Use();
  use.loader('builtin:swc-loader');

  const result = use.tap((options) => {
    expect(options).toBeUndefined();
    return { jsc: {} };
  });

  expect(result).toBe(use);
  expect(use.get('options')).toStrictEqual({ jsc: {} });
});

test('tap can leave options uninitialized', () => {
  const use = new Use();
  use.loader('builtin:swc-loader').tap((options) => options);

  expect(use.toConfig()).toStrictEqual({ loader: 'builtin:swc-loader' });
});

test('toConfig', () => {
  const rule = new Rule(null, 'alpha');
  const use = rule
    .use('beta')
    .loader('babel-loader')
    .parallel(true)
    .options({ presets: ['alpha'] });

  const config = use.toConfig();

  expect(config).toStrictEqual({
    loader: 'babel-loader',
    options: { presets: ['alpha'] },
    parallel: true,
  });

  expect(config.__ruleNames).toStrictEqual(['alpha']);
  expect(config.__ruleTypes).toStrictEqual(['rule']);
  expect(config.__useName).toBe('beta');
});

test('toConfig with parallel options', () => {
  const use = new Use();

  use.loader('babel-loader').parallel({ maxWorkers: 2 });

  expect(use.toConfig()).toStrictEqual({
    loader: 'babel-loader',
    parallel: { maxWorkers: 2 },
  });
});

test('toConfig with ident', () => {
  const use = new Use();

  use.loader('babel-loader').ident('babel-loader-ident');

  expect(use.toConfig()).toStrictEqual({
    loader: 'babel-loader',
    ident: 'babel-loader-ident',
  });
});
