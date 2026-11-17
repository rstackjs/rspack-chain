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

test('cloneFrom replaces configuration and keeps the target chain', () => {
  const callback = () => {};
  const instance = new (class Plugin {})();
  const source = new Rule(null, 'source')
    .use('swc')
    .loader('builtin:swc-loader')
    .parallel({ maxWorkers: 2 })
    .ident('swc-options')
    .options({
      nested: { values: ['a'], pattern: /test/g },
      callback,
      instance,
    })
    .after('other');
  const rule = new Rule(null, 'target');
  const target = rule.use('custom').options({ stale: true }).before('last');

  expect(target.cloneFrom(source)).toBe(target);
  expect(target.toConfig()).toStrictEqual(source.toConfig());
  expect(target.end()).toBe(rule);
  expect(target.toConfig().__useName).toBe('custom');
  expect(target.toConfig().__ruleNames).toStrictEqual(['target']);
  rule.use('last').loader('last-loader');
  expect(rule.toConfig().use.map((use) => use.loader)).toStrictEqual([
    'builtin:swc-loader',
    'last-loader',
  ]);

  target.tap((options) => {
    options.nested.values.push('b');
    options.nested.pattern.lastIndex = 2;
    expect(options.callback).toBe(callback);
    expect(options.instance).toBe(instance);
    return options;
  });
  target.get('parallel').maxWorkers = 4;
  expect(source.get('options').nested.values).toStrictEqual(['a']);
  expect(source.get('options').nested.pattern.lastIndex).toBe(0);
  expect(source.get('parallel')).toStrictEqual({ maxWorkers: 2 });
});

test('cloneFrom can preserve ordering constraints for later chain changes', () => {
  const source = new Rule(null, 'source').use('first').before('last');
  const rule = new Rule(null, 'target');
  rule.use('last').loader('last-loader');
  const target = rule.use('first').loader('stale-loader').after('last');
  target.cloneFrom(source, { preserveOrder: true }).loader('first-loader');
  rule.use('middle').loader('middle-loader').after('first');
  expect(rule.toConfig().use.map((use) => use.loader)).toStrictEqual([
    'first-loader',
    'middle-loader',
    'last-loader',
  ]);

  target.cloneFrom(new Use(), { preserveOrder: true }).after('last');
  expect(target.toConfig()).toStrictEqual({});
});

test('cloneFrom handles string options and cloning from itself', () => {
  const source = new Use().loader('custom-loader').options('key=value');
  const target = new Use().cloneFrom(source);
  expect(target.cloneFrom(target)).toBe(target);
  expect(target.toConfig()).toStrictEqual({
    loader: 'custom-loader',
    options: 'key=value',
  });
});

test('cloneFrom copies an own __proto__ property without changing the prototype', () => {
  const options = JSON.parse('{"__proto__":{"enabled":true}}');
  const source = new Use().options(options);
  const cloned = new Use().cloneFrom(source).get('options');

  expect(Object.getPrototypeOf(cloned)).toBe(Object.prototype);
  expect(Object.hasOwn(cloned, '__proto__')).toBe(true);
  expect(cloned).toStrictEqual(options);
  cloned.__proto__.enabled = false;
  expect(options.__proto__.enabled).toBe(true);
});
