import ChainedMap from './ChainedMap.js';
import ChainedValueMap from './ChainedValueMap.js';
import ChainedSet from './ChainedSet.js';
import Resolve from './Resolve.js';
import ResolveLoader from './ResolveLoader.js';
import Output from './Output.js';
import DevServer from './DevServer.js';
import Plugin from './Plugin.js';
import Module from './Module.js';
import Optimization from './Optimization.js';
import Performance from './Performance.js';
import { stringify } from 'javascript-stringify';

const castArray = (value) => (Array.isArray(value) ? value : [value]);

const toEntryObject = (entryPoints) => {
  const entry = Object.keys(entryPoints).reduce(
    (acc, key) => Object.assign(acc, { [key]: entryPoints[key].values() }),
    {},
  );

  const formattedEntry = {};

  for (const [entryName, entryValue] of Object.entries(entry)) {
    const entryImport = [];
    let entryDescription = null;

    for (const item of castArray(entryValue)) {
      if (typeof item === 'string') {
        entryImport.push(item);
        continue;
      }

      if (item.import) {
        entryImport.push(...castArray(item.import));
      }

      if (entryDescription) {
        // merge entry description object
        Object.assign(entryDescription, item);
      } else {
        entryDescription = item;
      }
    }

    formattedEntry[entryName] = entryDescription
      ? {
          ...entryDescription,
          import: entryImport,
        }
      : entryImport;
  }

  return formattedEntry;
};

export default class extends ChainedMap {
  constructor() {
    super();
    this.entryPoints = new ChainedMap(this);
    this.output = new Output(this);
    this.module = new Module(this);
    this.resolve = new Resolve(this);
    this.resolveLoader = new ResolveLoader(this);
    this.optimization = new Optimization(this);
    this.plugins = new ChainedMap(this);
    this.devServer = new DevServer(this);
    this.performance = new Performance(this);
    this.node = new ChainedValueMap(this);
    this.extend([
      'context',
      'mode',
      'devtool',
      'target',
      'watch',
      'watchOptions',
      'externals',
      'externalsType',
      'externalsPresets',
      'stats',
      'experiments',
      'amd',
      'bail',
      'cache',
      'dependencies',
      'ignoreWarnings',
      'loader',
      'name',
      'infrastructureLogging',
      'snapshot',
      'lazyCompilation',
    ]);
  }

  static toString(config, { verbose = false, configPrefix = 'config' } = {}) {
    return stringify(
      config,
      (value, indent, stringify) => {
        // improve plugin output
        if (value && value.__pluginName) {
          const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`;
          const constructorExpression = value.__pluginPath
            ? // The path is stringified to ensure special characters are escaped
              // (such as the backslashes in Windows-style paths).
              `(require(${stringify(value.__pluginPath)}))`
            : value.__pluginConstructorName;

          if (constructorExpression) {
            // get correct indentation for args by stringifying the args array and
            // discarding the square brackets.
            const args = stringify(value.__pluginArgs).slice(1, -1);
            return `${prefix}new ${constructorExpression}(${args})`;
          }
          return (
            prefix +
            stringify(
              value.__pluginArgs && value.__pluginArgs.length
                ? { args: value.__pluginArgs }
                : {},
            )
          );
        }

        // improve rule/use output
        if (value && value.__ruleNames) {
          const ruleTypes = value.__ruleTypes;
          const prefix = `/* ${configPrefix}.module${value.__ruleNames
            .map(
              (r, index) => `.${ruleTypes ? ruleTypes[index] : 'rule'}('${r}')`,
            )
            .join('')}${
            value.__useName ? `.use('${value.__useName}')` : ``
          } */\n`;
          return prefix + stringify(value);
        }

        if (value && value.__expression) {
          return value.__expression;
        }

        // shorten long functions
        if (typeof value === 'function') {
          if (!verbose && value.toString().length > 100) {
            return `function ${value.name || ''}() { /* omitted long function */ }`;
          }
        }

        return stringify(value);
      },
      2,
    );
  }

  entry(name) {
    return this.entryPoints.getOrCompute(name, () => new ChainedSet(this));
  }

  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
  }

  toConfig() {
    const entryPoints = this.entryPoints.entries() || {};
    const baseConfig = this.entries() || {};

    return this.clean(
      Object.assign(baseConfig, {
        node: this.node.entries(),
        output: this.output.entries(),
        resolve: this.resolve.toConfig(),
        resolveLoader: this.resolveLoader.toConfig(),
        devServer: this.devServer.toConfig(),
        module: this.module.toConfig(),
        optimization: this.optimization.toConfig(),
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: toEntryObject(entryPoints),
      }),
    );
  }

  toString(options) {
    return this.constructor.toString(this.toConfig(), options);
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'node',
      'output',
      'resolve',
      'resolveLoader',
      'devServer',
      'optimization',
      'performance',
      'module',
    ];

    if (!omit.includes('entry') && 'entry' in obj) {
      Object.keys(obj.entry).forEach((name) =>
        this.entry(name).merge([].concat(obj.entry[name])),
      );
    }

    if (!omit.includes('plugin') && 'plugin' in obj) {
      Object.keys(obj.plugin).forEach((name) =>
        this.plugin(name).merge(obj.plugin[name]),
      );
    }

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions, 'entry', 'plugin']);
  }
}
