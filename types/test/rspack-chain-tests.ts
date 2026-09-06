/**
 * Notes: The order structure of the type check follows the order
 * of this document: https://github.com/neutrinojs/rspack-chain#rspackchain
 */
import * as rspack from '@rspack/core';
import { RspackChain } from 'rspack-chain';

function expectType<T>(value: T) {}

// Unlike assignability checks, this also rejects an unexpected `any`.
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

function expectTypeEqual<A, B>(
  ..._args: Equal<A, B> extends true ? [] : [never]
) {}

const config = new RspackChain();

config.module
  .rule('javascript')
  .use<rspack.SwcLoaderOptions>('swc')
  .loader('builtin:swc-loader')
  .options({ detectSyntax: 'auto' })
  .tap((options) => {
    expectType<rspack.SwcLoaderOptions>(options);
    return options;
  });

config.module
  .rule('query')
  .use<string>('query')
  .options('cacheDirectory=true')
  .tap((options) => {
    expectType<string>(options);
    return options;
  });

const typedSwcUse = config.module
  .rule('javascript')
  .use<rspack.SwcLoaderOptions>('swc');
const typedSwcOptions = typedSwcUse.get('options');
expectTypeEqual<typeof typedSwcOptions, rspack.SwcLoaderOptions | undefined>();
typedSwcUse.set('options', { detectSyntax: 'auto' });
typedSwcUse.merge({ options: { detectSyntax: 'auto' } });
const computedSwcOptions = typedSwcUse.getOrCompute('options', () => ({
  detectSyntax: 'auto',
}));
expectTypeEqual<
  typeof computedSwcOptions,
  rspack.SwcLoaderOptions | undefined
>();
// @ts-expect-error typed loader options cannot be strings
typedSwcUse.options('invalid');
// @ts-expect-error typed option writes must preserve the concrete options type
typedSwcUse.set('options', 'invalid');
// @ts-expect-error merging cannot bypass the concrete options type
typedSwcUse.merge({ options: 'invalid' });
// @ts-expect-error computed options must preserve the concrete options type
typedSwcUse.getOrCompute('options', () => 'invalid');
// @ts-expect-error tap callbacks must return the concrete options type
typedSwcUse.tap(() => 'invalid');

const typedQueryUse = config.module.rule('query').use<string>('query');
const typedQueryOptions = typedQueryUse.get('options');
expectTypeEqual<typeof typedQueryOptions, string | undefined>();
typedQueryUse.set('options', 'cacheDirectory=true');
// @ts-expect-error string loader options cannot be objects
typedQueryUse.set('options', { cacheDirectory: true });

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
  .output.asyncChunks(true)
  .bundlerInfo({
    force: false,
  })
  .chunkFilename('')
  .chunkLoadTimeout(1000)
  .chunkLoadingGlobal('xasd')
  .crossOriginLoading('anonymous')
  .cssChunkFilename('css/[id].css')
  .cssFilename('css/[name].css')
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
  .importMetaName('import.meta')
  .path('/')
  .pathinfo(true)
  .publicPath('/')
  .sourceMapFilename('index.js.map')
  .strictModuleExceptionHandling(true)
  .trustedTypes('rspack')
  .workerPublicPath('/workers/')
  .workerWasmLoading('fetch')
  .iife(true)
  .webassemblyModuleFilename('[id].[hash].wasm')
  .clean({
    keep: 'foo',
  })
  .end()
  // module
  .module.noParse(/.min.js$/)
  .defaultRule('json')
  .type('json')
  .end()
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
  .descriptionData({
    type: 'module',
  })
  .extractSourceMap(true)
  .phase('source')
  .scheme('data')
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
  .ident('babel-loader-ident')
  .loader('babel-loader')
  .options({})
  .options('cacheDirectory=true')
  .parallel(true)
  .parallel({ maxWorkers: 2 })
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
  .set('foo', ['asd', false])
  .end()
  .tsConfig('./tsconfig.json')
  .delete('tsConfig')
  .tsConfig({
    configFile: './tsconfig.json',
    references: 'auto',
  })
  .fullySpecified(false)
  .pnp(true)
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
  .fallback.set('asd', ['asdasd', false])
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

  .plugin('asObject')
  .use({ apply: (compiler: rspack.Compiler) => {} })
  .end()

  .plugins.delete('foo')
  .delete('bar')
  .delete('baz')
  .delete('asObject')
  .end()
  // devServer
  .devServer(false)
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
  .extends('./rspack.base.js')
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
  .incremental({
    silent: true,
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

// @ts-expect-error plugin paths are not supported
config.plugin('asString').use('package-name-or-path');

// Known keys return precise types, including undefined for unset values.
const experiments = config.get('experiments');
expectTypeEqual<typeof experiments, rspack.Configuration['experiments']>();

const library = config.output.get('library');
expectTypeEqual<
  typeof library,
  NonNullable<rspack.Configuration['output']>['library']
>();

const cssRule = config.module.rule('css');
const resourceQuery = cssRule.get('resourceQuery');
expectTypeEqual<typeof resourceQuery, rspack.RuleSetRule['resourceQuery']>();

const swcUse = cssRule.use('swc');
const loader = swcUse.get('loader');
expectTypeEqual<typeof loader, string | undefined>();

const loaderOptions = swcUse.get('options');
expectTypeEqual<
  typeof loaderOptions,
  rspack.RuleSetLoaderWithOptions['options']
>();

// Custom keys and chain-specific merge structures remain compatible.
const metadata = config.set('customMetadata', true).get('customMetadata');
expectTypeEqual<typeof metadata, any>();
config.merge({
  plugin: { example: { plugin: rspack.DefinePlugin, args: [{}] } },
});
cssRule.merge({ use: { swc: { loader: 'builtin:swc-loader' } } });

// Direct writes and top-level merge fields validate known key types.
config.set('mode', 'development').merge({ mode: 'production' });
swcUse.set('loader', undefined);
const mode = config.getOrCompute('mode', () => 'development');
expectTypeEqual<typeof mode, rspack.Configuration['mode']>();
// @ts-expect-error mode cannot contain a number
config.set('mode', 123);
// @ts-expect-error merging cannot bypass the known key type
config.merge({ mode: 123 });
// @ts-expect-error computed values must match the known key type
config.getOrCompute('mode', () => 123);
// @ts-expect-error output keys are checked too
config.output.set('filename', 123);
// @ts-expect-error rule keys are checked too
cssRule.merge({ resourceQuery: 123 });
// @ts-expect-error loader values must be strings
swcUse.getOrCompute('loader', () => 123);

// Nested merge objects stay loose to support partial patches and named maps.
config.merge({
  entry: { main: ['./src/index.js'] },
  output: { library: { name: 'foo' }, customMetadata: true },
  module: {
    rule: {
      css: {
        oneOf: { inline: { use: { css: { options: { modules: true } } } } },
      },
    },
  },
  optimization: { minimizer: { custom: { plugin: rspack.DefinePlugin } } },
});
config.set('customMetadata', 123).merge({ customMetadata: false }, ['mode']);
const customValue = config.getOrCompute('customMetadata', () => 123);
expectTypeEqual<typeof customValue, any>();

// Partial object patches and named rule maps remain valid.
config.output.merge({ library: { name: 'bar' } });
cssRule.merge({ rules: { nested: {} }, oneOf: { inline: {} } });
config.module.merge({ noParse: /vendor/, rule: { css: {} }, defaultRule: {} });
config.output.merge({ enabledChunkLoadingTypes: ['jsonp'] });
// @ts-expect-error known module fields must retain their types
config.module.merge({ noParse: 123 });
// @ts-expect-error ordinary array fields cannot be replaced with objects
config.output.merge({ enabledChunkLoadingTypes: {} });
// @ts-expect-error array elements must remain complete plugin instances
config.merge({ plugins: [{}] });
// @ts-expect-error filename callbacks must still return strings
config.output.merge({ filename: () => 123 });

// Chain merge containers require named maps with valid entry or object values.
// @ts-expect-error entry shorthands are not supported by merge
config.merge({ entry: './src/index.js' });
// @ts-expect-error entry functions are not evaluated by merge
config.merge({ entry: () => './src/index.js' });
// @ts-expect-error use shorthands are not supported by merge
cssRule.merge({ use: 'style-loader' });
// @ts-expect-error use arrays containing strings are not supported by merge
cssRule.merge({ use: ['style-loader'] });
// @ts-expect-error rule patches must be objects
config.module.merge({ rule: { css: 123 } });
// @ts-expect-error default rule patches must be objects
config.module.merge({ defaultRule: { css: 123 } });

// Required override fields remain optional in merge patches.
declare const map: RspackChain.ChainedMap<void, unknown, { value: string }>;
map.merge({});
// @ts-expect-error override values retain their declared types
map.merge({ value: 123 });
// @ts-expect-error arrays are not named object patches
cssRule.merge({ use: { css: [] } });
// @ts-expect-error functions are not named object patches
cssRule.merge({ use: { css: () => {} } });
// @ts-expect-error RegExp instances are not named object patches
config.module.merge({ rule: { css: /css/ } });

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
