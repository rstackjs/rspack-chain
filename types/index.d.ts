import type {
  Configuration,
  RuleSetLoaderWithOptions,
  RuleSetRule,
} from '@rspack/core';

// The compiler type of Rspack / webpack are mismatch,
// so we use a loose type here to allow using webpack plugins.
interface PluginInstance {
  apply: (compiler: any) => void;
  [index: string]: any;
}

declare namespace __Config {
  // Allow loose object patches while preserving arrays and atomic values.
  type MergeValue<Value> = Value extends
    Function | readonly unknown[] | RegExp | Date
    ? Value
    : Value extends object
      ? Value | Record<string, unknown>
      : Value;

  type MergeInput<OptionsType> = {
    [Key in keyof OptionsType]?: MergeValue<OptionsType[Key]>;
  } & Record<string, any>;

  type NamedPatches = Record<string, Record<string, unknown>>;

  class Chained<Parent> {
    batch(handler: (chained: this) => void): this;
    end(): Parent;
  }
  class TypedChainedMap<Parent, OptionsType> extends Chained<Parent> {
    clear(): this;
    delete(key: string): this;
    has(key: string): boolean;
    get<T extends keyof OptionsType>(key: T): OptionsType[T];
    getOrCompute<T extends keyof OptionsType>(
      key: T,
      compute: () => OptionsType[T],
    ): OptionsType[T];
    set<T extends keyof OptionsType>(key: T, value: OptionsType[T]): this;
    merge(obj: Partial<OptionsType>): this;
    entries(): OptionsType;
    values<T extends keyof OptionsType>(): OptionsType[T][];
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this;
  }

  class ChainedMap<
    Parent,
    OptionsType = any,
    MergeOverrides = unknown,
  > extends TypedChainedMap<Parent, any> {
    // Known keys share their read/write types; custom keys remain unrestricted.
    get<Key extends PropertyKey>(
      key: Key,
    ): Key extends keyof OptionsType ? OptionsType[Key] | undefined : any;
    set<Key extends PropertyKey>(
      key: Key,
      value: Key extends keyof OptionsType ? OptionsType[Key] | undefined : any,
    ): this;
    getOrCompute<Key extends PropertyKey>(
      key: Key,
      compute: Key extends keyof OptionsType
        ? () => OptionsType[Key] | undefined
        : () => any,
    ): Key extends keyof OptionsType ? OptionsType[Key] | undefined : any;
    // Apply chain-specific container types without loosening their shape.
    merge(
      obj: MergeInput<Omit<OptionsType, keyof MergeOverrides>> &
        Partial<MergeOverrides>,
      omit?: string[],
    ): this;
  }
  class TypedChainedSet<Parent, Value> extends Chained<Parent> {
    add(value: Value): this;
    prepend(value: Value): this;
    clear(): this;
    delete(key: string): this;
    has(key: string): boolean;
    merge(arr: Value[]): this;
    values(): Value[];
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this;
  }

  class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
}

type RspackConfig = Required<Configuration>;
export declare class RspackChain extends __Config.ChainedMap<
  void,
  Configuration,
  {
    entry?: Record<
      string,
      RspackChain.RspackEntryObject | RspackChain.RspackEntryObject[]
    >;
  }
> {
  entryPoints: RspackChain.TypedChainedMap<
    RspackChain,
    { [key: string]: RspackChain.EntryPoint }
  >;
  output: RspackChain.Output;
  module: RspackChain.Module;
  node: RspackChain.ChainedMap<this> & ((value: false) => this);
  optimization: RspackChain.Optimization;
  performance: RspackChain.Performance & ((value: false) => this);
  plugins: RspackChain.Plugins<this, PluginInstance>;
  resolve: RspackChain.Resolve;
  resolveLoader: RspackChain.ResolveLoader;
  devServer: RspackChain.DevServer & ((value: false) => this);

  context(value: RspackConfig['context'] | undefined): this;
  mode(value: RspackConfig['mode'] | undefined): this;
  devtool(value: RspackChain.DevTool | undefined): this;
  target(value: RspackConfig['target'] | undefined): this;
  watch(value: RspackConfig['watch'] | undefined): this;
  watchOptions(value: RspackConfig['watchOptions'] | undefined): this;
  externals(value: RspackConfig['externals'] | undefined): this;
  externalsType(value: RspackConfig['externalsType'] | undefined): this;
  externalsPresets(value: RspackConfig['externalsPresets'] | undefined): this;
  stats(value: RspackConfig['stats'] | undefined): this;
  experiments(value: RspackConfig['experiments'] | undefined): this;
  amd(value: RspackConfig['amd'] | undefined): this;
  bail(value: RspackConfig['bail'] | undefined): this;
  cache(value: RspackConfig['cache'] | undefined): this;
  dependencies(value: RspackConfig['dependencies'] | undefined): this;
  extends(value: RspackConfig['extends'] | undefined): this;
  ignoreWarnings(value: RspackConfig['ignoreWarnings'] | undefined): this;
  loader(value: RspackConfig['loader'] | undefined): this;
  name(value: RspackConfig['name'] | undefined): this;
  infrastructureLogging(
    value: RspackConfig['infrastructureLogging'] | undefined,
  ): this;
  lazyCompilation(value: RspackConfig['lazyCompilation'] | undefined): this;
  incremental(value: RspackConfig['incremental'] | undefined): this;

  entry(name: string): RspackChain.EntryPoint;
  plugin(name: string): RspackChain.Plugin<this, PluginInstance>;

  toConfig(): Configuration;

  static toString(
    config: any,
    {
      verbose,
      configPrefix,
    }?: {
      verbose?: boolean | undefined;
      configPrefix?: string | undefined;
    },
  ): string;
}

export declare namespace RspackChain {
  class Chained<Parent> extends __Config.Chained<Parent> {}
  class TypedChainedMap<Parent, OptionsType> extends __Config.TypedChainedMap<
    Parent,
    OptionsType
  > {}
  class ChainedMap<
    Parent,
    OptionsType = any,
    MergeOverrides = unknown,
  > extends __Config.ChainedMap<Parent, OptionsType, MergeOverrides> {}
  class TypedChainedSet<Parent, Value> extends __Config.TypedChainedSet<
    Parent,
    Value
  > {}
  class ChainedSet<Parent> extends __Config.TypedChainedSet<Parent, any> {}

  class Plugins<
    Parent,
    PluginType extends PluginInstance,
  > extends TypedChainedMap<
    Parent,
    { [key: string]: Plugin<Parent, PluginType> }
  > {}

  class Plugin<Parent, PluginType extends PluginInstance>
    extends ChainedMap<Parent>
    implements Orderable
  {
    init<P extends PluginType | PluginClass<PluginType>>(
      value: (
        plugin: P,
        args: P extends PluginClass<PluginType>
          ? ConstructorParameters<P>
          : any[],
      ) => PluginType,
    ): this;
    use<P extends PluginType | PluginClass<PluginType>>(
      plugin: P,
      args?: P extends PluginClass<PluginType>
        ? ConstructorParameters<P>
        : any[],
    ): this;
    tap<P extends PluginClass<PluginType>>(
      f: (args: ConstructorParameters<P>) => ConstructorParameters<P>,
    ): this;

    // Orderable
    before(name: string): this;
    after(name: string): this;
  }

  type RspackEntry = NonNullable<Configuration['entry']>;

  type RspackEntryObject = Exclude<
    RspackEntry,
    string | string[] | Function
  >[string];

  class EntryPoint extends TypedChainedSet<RspackChain, RspackEntryObject> {}

  type RspackModule = Required<NonNullable<Configuration['module']>>;

  class Module extends ChainedMap<
    RspackChain,
    NonNullable<Configuration['module']>,
    { rule?: __Config.NamedPatches; defaultRule?: __Config.NamedPatches }
  > {
    defaultRules: TypedChainedMap<this, { [key: string]: Rule }>;
    rules: TypedChainedMap<this, { [key: string]: Rule }>;
    generator: ChainedMap<this>;
    parser: ChainedMap<this>;
    defaultRule(name: string): Rule;
    rule(name: string): Rule;
    noParse(value: RspackModule['noParse'] | undefined): this;
  }

  type RspackOutput = Required<NonNullable<Configuration['output']>>;

  class Output extends ChainedMap<
    RspackChain,
    NonNullable<Configuration['output']>
  > {
    assetModuleFilename(
      value: RspackOutput['assetModuleFilename'] | undefined,
    ): this;
    asyncChunks(value: RspackOutput['asyncChunks'] | undefined): this;
    bundlerInfo(value: RspackOutput['bundlerInfo'] | undefined): this;
    chunkFilename(value: RspackOutput['chunkFilename'] | undefined): this;
    chunkLoadTimeout(value: RspackOutput['chunkLoadTimeout'] | undefined): this;
    chunkLoadingGlobal(
      value: RspackOutput['chunkLoadingGlobal'] | undefined,
    ): this;
    chunkLoading(value: RspackOutput['chunkLoading'] | undefined): this;
    chunkFormat(value: RspackOutput['chunkFormat'] | undefined): this;
    crossOriginLoading(
      value: RspackOutput['crossOriginLoading'] | undefined,
    ): this;
    cssChunkFilename(value: RspackOutput['cssChunkFilename'] | undefined): this;
    cssFilename(value: RspackOutput['cssFilename'] | undefined): this;
    devtoolFallbackModuleFilenameTemplate(
      value: RspackOutput['devtoolFallbackModuleFilenameTemplate'] | undefined,
    ): this;
    devtoolModuleFilenameTemplate(
      value: RspackOutput['devtoolModuleFilenameTemplate'] | undefined,
    ): this;
    devtoolNamespace(value: RspackOutput['devtoolNamespace'] | undefined): this;
    enabledChunkLoadingTypes(
      value: RspackOutput['enabledChunkLoadingTypes'] | undefined,
    ): this;
    filename(value: RspackOutput['filename'] | undefined): this;
    globalObject(value: RspackOutput['globalObject'] | undefined): this;
    uniqueName(value: RspackOutput['uniqueName'] | undefined): this;
    hashDigest(value: RspackOutput['hashDigest'] | undefined): this;
    hashDigestLength(value: RspackOutput['hashDigestLength'] | undefined): this;
    hashFunction(value: RspackOutput['hashFunction'] | undefined): this;
    hashSalt(value: RspackOutput['hashSalt'] | undefined): this;
    hotUpdateChunkFilename(
      value: RspackOutput['hotUpdateChunkFilename'] | undefined,
    ): this;
    hotUpdateGlobal(value: RspackOutput['hotUpdateGlobal'] | undefined): this;
    hotUpdateMainFilename(
      value: RspackOutput['hotUpdateMainFilename'] | undefined,
    ): this;
    library(value: RspackOutput['library'] | undefined): this;
    importFunctionName(
      value: RspackOutput['importFunctionName'] | undefined,
    ): this;
    importMetaName(value: RspackOutput['importMetaName'] | undefined): this;
    path(value: RspackOutput['path'] | undefined): this;
    pathinfo(value: RspackOutput['pathinfo'] | undefined): this;
    publicPath(value: RspackOutput['publicPath'] | undefined): this;
    scriptType(value: RspackOutput['scriptType'] | undefined): this;
    sourceMapFilename(
      value: RspackOutput['sourceMapFilename'] | undefined,
    ): this;
    strictModuleErrorHandling(
      value: RspackOutput['strictModuleErrorHandling'] | undefined,
    ): this;
    strictModuleExceptionHandling(
      value: RspackOutput['strictModuleExceptionHandling'] | undefined,
    ): this;
    trustedTypes(value: RspackOutput['trustedTypes'] | undefined): this;
    workerChunkLoading(
      value: RspackOutput['workerChunkLoading'] | undefined,
    ): this;
    workerPublicPath(value: RspackOutput['workerPublicPath'] | undefined): this;
    workerWasmLoading(
      value: RspackOutput['workerWasmLoading'] | undefined,
    ): this;
    enabledLibraryTypes(
      value: RspackOutput['enabledLibraryTypes'] | undefined,
    ): this;
    environment(value: RspackOutput['environment'] | undefined): this;
    compareBeforeEmit(
      value: RspackOutput['compareBeforeEmit'] | undefined,
    ): this;
    wasmLoading(value: RspackOutput['wasmLoading'] | undefined): this;
    webassemblyModuleFilename(
      value: RspackOutput['webassemblyModuleFilename'] | undefined,
    ): this;
    enabledWasmLoadingTypes(
      value: RspackOutput['enabledWasmLoadingTypes'] | undefined,
    ): this;
    iife(value: RspackOutput['iife'] | undefined): this;
    module(value: RspackOutput['module'] | undefined): this;
    clean(value: RspackOutput['clean'] | undefined): this;
  }

  type RspackDevServer = Required<
    Exclude<Configuration['devServer'], false | null | undefined>
  >;

  type DevServerShorthandMethods<T> = {
    [K in keyof RspackDevServer]-?: (
      value: RspackDevServer[K] | undefined,
    ) => T;
  };

  // rslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
  class DevServer extends TypedChainedMap<RspackChain, RspackDevServer> {}

  // rslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
  interface DevServer extends DevServerShorthandMethods<DevServer> {}

  type RspackPerformance = Exclude<
    Required<NonNullable<Configuration['performance']>>,
    false
  >;
  class Performance extends ChainedMap<RspackChain> {
    hints(value: RspackPerformance['hints'] | undefined): this;
    maxEntrypointSize(
      value: RspackPerformance['maxEntrypointSize'] | undefined,
    ): this;
    maxAssetSize(value: RspackPerformance['maxAssetSize'] | undefined): this;
    assetFilter(value: RspackPerformance['assetFilter'] | undefined): this;
  }

  type RspackResolve = Required<NonNullable<Configuration['resolve']>>;
  type RspackResolveAlias = Exclude<RspackResolve['alias'], false>;
  class Resolve<T = RspackChain> extends ChainedMap<T> {
    alias: TypedChainedMap<this, RspackResolveAlias>;
    aliasFields: TypedChainedSet<this, RspackResolve['aliasFields'][number]>;
    conditionNames: TypedChainedSet<
      this,
      RspackResolve['conditionNames'][number]
    >;
    descriptionFiles: TypedChainedSet<
      this,
      RspackResolve['descriptionFiles'][number]
    >;
    extensions: TypedChainedSet<this, RspackResolve['extensions'][number]>;
    extensionAlias: TypedChainedMap<this, RspackResolve['extensionAlias']>;
    mainFields: TypedChainedSet<this, RspackResolve['mainFields'][number]>;
    mainFiles: TypedChainedSet<this, RspackResolve['mainFiles'][number]>;
    exportsFields: TypedChainedSet<
      this,
      RspackResolve['exportsFields'][number]
    >;
    importsFields: TypedChainedSet<
      this,
      RspackResolve['importsFields'][number]
    >;
    restrictions: TypedChainedSet<this, RspackResolve['restrictions'][number]>;
    roots: TypedChainedSet<this, RspackResolve['roots'][number]>;
    modules: TypedChainedSet<this, RspackResolve['modules'][number]>;
    fallback: TypedChainedMap<this, RspackResolveAlias>;
    byDependency: TypedChainedMap<this, RspackResolve['byDependency']>;
    enforceExtension(
      value: RspackResolve['enforceExtension'] | undefined,
    ): this;
    fullySpecified(value: RspackResolve['fullySpecified'] | undefined): this;
    pnp(value: RspackResolve['pnp'] | undefined): this;
    symlinks(value: RspackResolve['symlinks'] | undefined): this;
    preferRelative(value: RspackResolve['preferRelative'] | undefined): this;
    preferAbsolute(value: RspackResolve['preferAbsolute'] | undefined): this;

    tsConfig(value: RspackResolve['tsConfig'] | undefined): this;
  }
  class RuleResolve<T = RspackChain> extends Resolve<T> {}

  class ResolveLoader extends Resolve {
    modules: ChainedSet<this>;
    moduleExtensions: ChainedSet<this>;
    packageMains: ChainedSet<this>;
  }

  type RspackRuleSet = Required<RuleSetRule>;

  class Rule<T = Module>
    extends ChainedMap<
      T,
      RuleSetRule,
      {
        use?: __Config.NamedPatches;
        rules?: __Config.NamedPatches;
        oneOf?: __Config.NamedPatches;
      }
    >
    implements Orderable
  {
    uses: TypedChainedMap<this, { [key: string]: Use }>;
    include: TypedChainedSet<this, RspackRuleSet['include']>;
    exclude: TypedChainedSet<this, RspackRuleSet['exclude']>;
    rules: TypedChainedMap<this, { [key: string]: Rule<Rule> }>;
    oneOfs: TypedChainedMap<this, { [key: string]: Rule<Rule> }>;
    resolve: RuleResolve<Rule<T>>;

    dependency(value: RspackRuleSet['dependency'] | undefined): this;
    descriptionData(value: RspackRuleSet['descriptionData'] | undefined): this;
    enforce(value: RspackRuleSet['enforce'] | undefined): this;
    extractSourceMap(
      value: RspackRuleSet['extractSourceMap'] | undefined,
    ): this;
    issuer(value: RspackRuleSet['issuer'] | undefined): this;
    issuerLayer(value: RspackRuleSet['issuerLayer'] | undefined): this;
    layer(value: RspackRuleSet['layer'] | undefined): this;
    mimetype(value: RspackRuleSet['mimetype'] | undefined): this;
    phase(value: RspackRuleSet['phase'] | undefined): this;
    parser(value: RspackRuleSet['parser'] | undefined): this;
    generator(value: RspackRuleSet['generator'] | undefined): this;
    resource(value: RspackRuleSet['resource'] | undefined): this;
    resourceFragment(
      value: RspackRuleSet['resourceFragment'] | undefined,
    ): this;
    resourceQuery(value: RspackRuleSet['resourceQuery'] | undefined): this;
    scheme(value: RspackRuleSet['scheme'] | undefined): this;
    sideEffects(value: RspackRuleSet['sideEffects'] | undefined): this;
    with(value: RspackRuleSet['with'] | undefined): this;
    test(value: RspackRuleSet['test'] | undefined): this;
    type(value: RspackRuleSet['type'] | undefined): this;

    use<Options extends LoaderOptions = LoaderOptions>(
      name: string,
    ): Use<this, Options>;
    rule(name: string): Rule<Rule>;
    oneOf(name: string): Rule<Rule>;
    pre(): this;
    post(): this;
    before(name: string): this;
    after(name: string): this;
  }

  type RspackOptimization = Required<
    NonNullable<Configuration['optimization']>
  >;
  type SplitChunksObject = Exclude<RspackOptimization['splitChunks'], false>;
  class Optimization extends ChainedMap<RspackChain> {
    minimizer(name: string): RspackChain.Plugin<this, PluginInstance>;
    minimizers: TypedChainedMap<this, RspackChain.Plugin<this, PluginInstance>>;
    splitChunks: TypedChainedMap<this, SplitChunksObject> &
      ((value: SplitChunksObject | false) => this);

    minimize(value: RspackOptimization['minimize'] | undefined): this;
    runtimeChunk(value: RspackOptimization['runtimeChunk'] | undefined): this;
    emitOnErrors(value: RspackOptimization['emitOnErrors'] | undefined): this;
    moduleIds(value: RspackOptimization['moduleIds'] | undefined): this;
    chunkIds(value: RspackOptimization['chunkIds'] | undefined): this;
    nodeEnv(value: RspackOptimization['nodeEnv'] | undefined): this;
    removeEmptyChunks(
      value: RspackOptimization['removeEmptyChunks'] | undefined,
    ): this;
    mergeDuplicateChunks(
      value: RspackOptimization['mergeDuplicateChunks'] | undefined,
    ): this;
    providedExports(
      value: RspackOptimization['providedExports'] | undefined,
    ): this;
    usedExports(value: RspackOptimization['usedExports'] | undefined): this;
    concatenateModules(
      value: RspackOptimization['concatenateModules'] | undefined,
    ): this;
    sideEffects(value: RspackOptimization['sideEffects'] | undefined): this;
    mangleExports(value: RspackOptimization['mangleExports'] | undefined): this;
    innerGraph(value: RspackOptimization['innerGraph'] | undefined): this;
    realContentHash(
      value: RspackOptimization['realContentHash'] | undefined,
    ): this;
    avoidEntryIife(
      value: RspackOptimization['avoidEntryIife'] | undefined,
    ): this;
    inlineExports(value: RspackOptimization['inlineExports'] | undefined): this;
  }

  interface RuntimeChunk {
    name: string | RuntimeChunkFunction;
  }

  type RuntimeChunkFunction = (entryPoint: EntryPoint) => string;

  interface SplitChunksOptions {
    [name: string]: any;
  }

  type LoaderOptions = NonNullable<RuleSetLoaderWithOptions['options']>;

  type LoaderParallelOptions = NonNullable<
    RuleSetLoaderWithOptions['parallel']
  >;

  class Use<Parent = Rule, Options extends LoaderOptions = LoaderOptions>
    extends ChainedMap<
      Parent,
      Omit<RuleSetLoaderWithOptions, 'options'> & { options?: Options }
    >
    implements Orderable
  {
    ident(
      value: NonNullable<RuleSetLoaderWithOptions['ident']> | undefined,
    ): this;
    loader(value: string): this;
    options(value: Options | undefined): this;
    parallel(value: LoaderParallelOptions | undefined): this;

    tap(f: (options: Options) => Options): this;

    // Orderable
    before(name: string): this;
    after(name: string): this;
  }

  // [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map[-debugids].
  export type DevTool = RspackConfig['devtool'];

  interface PluginClass<PluginType extends PluginInstance> {
    new (...opts: any[]): PluginType;
  }

  interface Orderable {
    before(name: string): this;
    after(name: string): this;
  }
}
