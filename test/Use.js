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
