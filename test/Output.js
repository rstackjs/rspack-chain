import Output from '../src/Output';

test('is Chainable', () => {
  const parent = { parent: true };
  const output = new Output(parent);

  expect(output.end()).toBe(parent);
});

test('shorthand methods', () => {
  const output = new Output();
  const obj = {};

  output.shorthands.forEach((method) => {
    obj[method] = 'alpha';
    expect(output[method]('alpha')).toBe(output);
  });

  expect(output.entries()).toStrictEqual(obj);
});

test('asyncChunks', () => {
  const output = new Output();

  expect(output.asyncChunks(false)).toBe(output);
  expect(output.entries()).toStrictEqual({
    asyncChunks: false,
  });
});

test('cssFilename', () => {
  const output = new Output();

  expect(output.cssFilename('css/[name].css')).toBe(output);
  expect(output.entries()).toStrictEqual({
    cssFilename: 'css/[name].css',
  });
});

test('cssChunkFilename', () => {
  const output = new Output();

  expect(output.cssChunkFilename('css/[id].css')).toBe(output);
  expect(output.entries()).toStrictEqual({
    cssChunkFilename: 'css/[id].css',
  });
});

test('importMetaName', () => {
  const output = new Output();

  expect(output.importMetaName('import.meta')).toBe(output);
  expect(output.entries()).toStrictEqual({
    importMetaName: 'import.meta',
  });
});

test('trustedTypes', () => {
  const output = new Output();

  expect(output.trustedTypes('rspack')).toBe(output);
  expect(output.entries()).toStrictEqual({
    trustedTypes: 'rspack',
  });
});

test('workerWasmLoading', () => {
  const output = new Output();

  expect(output.workerWasmLoading('fetch')).toBe(output);
  expect(output.entries()).toStrictEqual({
    workerWasmLoading: 'fetch',
  });
});
