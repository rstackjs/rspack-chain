import DevServer from '../src/DevServer';

test('is Chainable', () => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  expect(devServer.end()).toBe(parent);
});

test('sets allowed hosts', () => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts.add('https://github.com').end();

  expect(instance).toBe(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://github.com'],
  });
});

test('merges allowedHosts with non-array values', () => {
  const devServer = new DevServer();

  devServer.merge({
    allowedHosts: 'auto',
  });

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: 'auto',
  });
});

test('ignores undefined allowedHosts during merge', () => {
  const devServer = new DevServer();

  devServer.allowedHosts.add('https://github.com');
  devServer.merge({
    allowedHosts: undefined,
  });

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://github.com'],
  });
});

test('sets allowedHosts with non-array values', () => {
  const devServer = new DevServer();

  devServer.set('allowedHosts', 'all');

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: 'all',
  });
});

test('clears stale allowedHosts entries when deleting scalar values', () => {
  const devServer = new DevServer();

  devServer.allowedHosts.add('https://github.com');
  devServer.set('allowedHosts', 'all');
  devServer.delete('allowedHosts');

  expect(devServer.toConfig()).toStrictEqual({});
});

test('replaces scalar allowedHosts with array values during merge', () => {
  const devServer = new DevServer();

  devServer.allowedHosts.add('https://github.com');
  devServer.set('allowedHosts', 'all');
  devServer.merge({
    allowedHosts: ['https://rspack.rs'],
  });

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://rspack.rs'],
  });
});

test('preserves omitted keys during merge', () => {
  const devServer = new DevServer();

  devServer.proxy('https://example.com');
  devServer.merge(
    {
      proxy: 'https://rspack.rs',
    },
    ['proxy'],
  );

  expect(devServer.toConfig()).toStrictEqual({
    proxy: 'https://example.com',
  });
});

test('clear removes allowedHosts values', () => {
  const devServer = new DevServer();

  devServer.allowedHosts.add('https://github.com');
  devServer.clear();

  expect(devServer.toConfig()).toStrictEqual({});
});

test('shorthand methods', () => {
  const devServer = new DevServer();
  const obj = {};

  devServer.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    expect(devServer[method]('alpha')).toBe(devServer);
  });

  expect(devServer.entries()).toStrictEqual(obj);
});
