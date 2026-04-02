/**
 * Notes: The order structure of the type check follows the order
 * of this document: https://github.com/neutrinojs/rspack-chain#rspackchain
 */
import * as rspack from '@rspack/core';
import { RspackChain } from 'rspack-chain';

function expectType<T>(value: T) {}

const config = new RspackChain();

config
  // entry
  .entry('main')
  .add('index.js')
  .add(['index.js', 'xxx.js'])
  .add({
    import: './personal.js',
    filename: 'pages/personal.js',
    dependOn: 'shared',
    chunkLoading: 'jsonp',
    layer: 'name of layer',
  })
  .delete('index.js')
  .clear()
  .when(
    false,
    (entry) => entry.clear(),
    (entry) => entry.clear(),
  )
  .batch((x) => {})
  .end()
  // entryPoints
  .entryPoints.delete('main')
  .end()
  // output
  .output.bundlerInfo({
    force: false,
  })
  .chunkFilename('')
  .chunkLoadTimeout(1000)
  .chunkLoadingGlobal('xasd')
  .crossOriginLoading('anonymous')
  .devtoolFallbackModuleFilenameTemplate('')
  .devtoolNamespace('')
  .devtoolModuleFilenameTemplate('')
  .filename('main.js')
  .globalObject('global')
  .hashFunction('md4')
  .hashDigest('md5')
  .hashDigestLength(15)
  .hashSalt('')
  .hotUpdateChunkFilename('update')
  .hotUpdateMainFilename('main')
  .library('var')
  .path('/')
  .pathinfo(true)
  .publicPath('/')
  .sourceMapFilename('index.js.map')
  .strictModuleExceptionHandling(true)
  .iife(true)
  .webassemblyModuleFilename('[id].[hash].wasm')
  .clean({
    keep: 'foo',
  })
  .end()
  // module
  .module.noParse(/.min.js$/)
  .generator.set('asset', {
    publicPath: 'assets/',
  })
  .end()
  // module rule
  .rule('compile')
  .test(/.js$/)
  .include.add(/.js$/)
  .end()
  .exclude.add(/node_modules/)
  .end()
  .parser({
    opt: 'foo',
  })
  .enforce('pre')
  .dependency('asd')
  .issuer('asd')
  .issuerLayer('asd')
  .sideEffects(true)
  .mimetype('application/json')
  .with({
    type: 'url',
  })
  .generator({
    asset: {
      publicPath: 'assets/',
    },
  })
  .use('babel')
  .tap((config) => [])
  .loader('babel-loader')
  .options({})
  .parallel(true)
  .end()
  .use('eslint')
  .loader('eslint-loader')
  .options({})
  .after('babel')
  .end()
  .uses.delete('babel')
  .delete('eslint')
  .end()
  .pre()
  .post()
  .rule('inline')
  .after('vue')
  .resource(/foo/)
  .resourceFragment(/bar/)
  .resourceQuery(/inline/)
  .use('url')
  .loader('url-loader')
  .end()
  .resolve.symlinks(true)
  .fullySpecified(false)
  .end()
  .end()
  .rules.delete('inline')
  .end()
  .oneOf('inline')
  .after('vue')
  .uses.delete('babel')
  .end()
  .resourceQuery(/inline/)
  .use('url')
  .loader('url-loader')
  .end()
  .end()
  .oneOfs.delete('inline')
  .end()
  .resolve.symlinks(true)
  .end()
  .end()
  .rules.delete('compile')
  .end()
  //** support https://rspack.js.org/configuration/module/#ruletype  */
  .rule('mjs-compile')
  .test(/\.mjs$/)
  .type('javascript/auto')
  .end()
  .end()
  // resolve
  .resolve.alias.set('foo', 'bar')
  .set('foo', false)
  .set('foo', ['asd'])
  .end()
  .tsConfig('./tsconfig.json')
  .delete('tsConfig')
  .tsConfig({
    configFile: './tsconfig.json',
    references: 'auto',
  })
  .modules.add('index.js')
  .end()
  .aliasFields.add('foo')
  // Rspack does not support this
  // .add(['foo'])
  .end()
  .conditionNames.add('foo')
  .end()
  .descriptionFiles.add('foo')
  .end()
  .mainFiles.add('foo')
  .end()
  .extensions.add('.js')
  .end()
  .extensionAlias.set('a', 'b')
  .set('b', ['c'])
  .end()
  .mainFields.add('browser')
  .end()
  .mainFiles.add('index.js')
  .end()
  .roots.add('asdasd')
  .end()
  .fallback.set('asd', ['asdasd'])
  .end()
  .byDependency.set('esm', {
    mainFields: ['browser', 'module'],
  })
  .end()
  .enforceExtension(true)
  .symlinks(true)
  .preferRelative(true)
  .preferAbsolute(true)
  .end()
  // resolveLoader
  .resolveLoader.moduleExtensions.add('.js')
  .end()
  .packageMains.add('index.js')
  .end()
  .modules.add('index.js')
  .end()
  .preferAbsolute(false)
  .end()
  // optimization
  .optimization.concatenateModules(true)
  .mergeDuplicateChunks(true)
  .minimize(true)
  .nodeEnv(false)
  .providedExports(true)
  .removeEmptyChunks(true)
  .runtimeChunk('single')
  .runtimeChunk({ name: ({}) => 'hello' })
  .sideEffects(true)
  .usedExports(true)
  .avoidEntryIife(true)
  .splitChunks(false)
  .splitChunks.set('chunks', 'all')
  .set('chunks', 'all')
  .end()
  .minimizer('foo')
  .use(rspack.DefinePlugin)
  .tap((config) => [])
  .end()
  .minimizers.delete('bar')
  .end()
  .end()
  // plugins
  .plugin('foo')
  .use(rspack.DefinePlugin, [
    {
      'process.env.NODE_ENV': '',
    },
  ])
  .end()

  .plugin('bar')
  .use(rspack.DefinePlugin, [
    {
      'process.env.NODE_ENV': '',
    },
  ])
  .before('foo')
  .end()

  .plugin('baz')
  .use(rspack.DefinePlugin, [
    {
      'process.env.NODE_ENV': '',
    },
  ])
  .after('bar')
  .end()

  .plugin('asString')
  .use('package-name-or-path')
  .end()

  .plugin('asObject')
  .use({ apply: (compiler: rspack.Compiler) => {} })
  .end()

  .plugins.delete('foo')
  .delete('bar')
  .delete('baz')
  .delete('asString')
  .delete('asObject')
  .end()
  // devServer
  .devServer.allowedHosts(['host.com'])
  .allowedHosts('auto')
  .merge({
    allowedHosts: ['host.com'],
    hot: 'only',
  })
  .app(async () => {
    throw new Error('not used in type tests');
  })
  .client({
    logging: 'warn',
    overlay: {
      warnings: true,
      errors: true,
      runtimeErrors: false,
    },
    progress: true,
    reconnect: 3,
    webSocketTransport: 'ws',
    webSocketURL: {
      protocol: 'ws',
      port: 8080,
    },
  })
  .compress(false)
  .devMiddleware({
    index: 'index.html',
    mimeTypes: {
      'text/html': 'text/html',
    },
    stats: 'errors-warnings',
    writeToDisk: true,
  })
  .headers({
    'Content-Type': 'text/css',
  })
  .headers((req, res, context) => ({
    'X-Test': 'true',
  }))
  .historyApiFallback(true)
  .host('localhost')
  .hot(true)
  .ipc(true)
  .liveReload(true)
  .open(true)
  .port(8080)
  .proxy([
    {
      context: ['/api'],
      target: 'http://localhost:3000',
    },
  ])
  .server({
    type: 'https',
    options: {},
  })
  .setupExitSignals(true)
  .setupMiddlewares((middlewares) => middlewares)
  .static({
    directory: '/tmp/public',
    publicPath: ['/assets'],
    watch: {
      poll: 1000,
    },
  })
  .watchFiles([
    'src/**/*',
    {
      paths: ['templates/**/*'],
      options: {
        poll: 1000,
      },
    },
  ])
  .webSocketServer('ws')
  .end()
  // performance
  .performance(false)
  .performance.hints(false)
  .hints('warning')
  .maxEntrypointSize(20000)
  .maxAssetSize(20000)
  .assetFilter((filename: string) => true)
  .end()
  // node
  .node(false)
  .node.set('__dirname', true)
  .delete('__dirname')
  .clear()
  .end()
  // other
  .node(false)
  .amd({ foo: true })
  .bail(true)
  .cache(false)
  .cache({
    type: 'persistent',
  })
  .devtool('hidden-source-map')
  .devtool(false)
  .context('')
  .externals('foo')
  .externals(/node_modules/)
  .externals({ test: false, foo: 'bar' })
  .externals(['foo', 'bar'])
  .externals((ctx, cb: (err0: Error | undefined, result: string) => void) =>
    cb(undefined, 'foo'),
  )
  .loader({})
  .name('config-name')
  .mode('none')
  .mode('development')
  .mode('production')
  .stats({
    assets: false,
    publicPath: true,
    modules: false,
  })
  .target('web')
  .watch(true)
  .watchOptions({})
  .when(
    false,
    (config) => config.watch(true),
    (config) => config.watch(false),
  )
  // end
  .merge({})
  .toConfig();

// Test TypedChainedMap
const entryPoints = config.entryPoints;

expectType<typeof entryPoints>(entryPoints.clear());
expectType<typeof entryPoints>(entryPoints.delete('key'));
expectType<boolean>(entryPoints.has('key'));
expectType<RspackChain.EntryPoint>(entryPoints.get('key'));
expectType<RspackChain.EntryPoint>(
  entryPoints.getOrCompute('key', () => new RspackChain.EntryPoint()),
);
expectType<typeof entryPoints>(
  entryPoints.set('key', new RspackChain.EntryPoint()),
);
expectType<typeof entryPoints>(
  entryPoints.merge({
    key: new RspackChain.EntryPoint(),
  }),
);
expectType<Record<string, RspackChain.EntryPoint>>(entryPoints.entries());
expectType<typeof entryPoints>(
  entryPoints.when(
    true,
    (val) => {
      expectType<typeof entryPoints>(val);
    },
    (val) => {
      expectType<typeof entryPoints>(val);
    },
  ),
);

// Test TypedChainedSet
const extensions = config.resolve.extensions;

expectType<typeof extensions>(extensions.add('.txt'));
expectType<typeof extensions>(extensions.prepend('.txt'));
expectType<typeof extensions>(extensions.clear());
expectType<typeof extensions>(extensions.delete('.txt'));
expectType<boolean>(extensions.has('.txt'));
expectType<typeof extensions>(extensions.merge(['.txt']));
expectType<string[]>(extensions.values());
expectType<typeof extensions>(
  extensions.when(
    true,
    (val) => {
      expectType<typeof extensions>(val);
    },
    (val) => {
      expectType<typeof extensions>(val);
    },
  ),
);
