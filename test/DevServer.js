import DevServer from '../src/DevServer';

test('is Chainable', () => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  expect(devServer.end()).toBe(parent);
});

test('sets allowed hosts arrays', () => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts(['https://github.com']);

  expect(instance).toBe(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://github.com'],
  });
});

test('sets allowed hosts scalar values', () => {
  const devServer = new DevServer();

  devServer.allowedHosts('all');

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: 'all',
  });
});

test('merges allowedHosts values', () => {
  const devServer = new DevServer();

  devServer.allowedHosts('auto');
  devServer.merge({
    allowedHosts: ['https://github.com'],
  });

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ['https://github.com'],
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

test('shorthand methods', () => {
  const devServer = new DevServer();
  const obj = {};

  devServer.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    expect(devServer[method]('alpha')).toBe(devServer);
  });

  expect(devServer.entries()).toStrictEqual(obj);
});
