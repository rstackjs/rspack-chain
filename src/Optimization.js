import ChainedMap from './ChainedMap.js';
import ChainedValueMap from './ChainedValueMap.js';
import Plugin from './Plugin.js';

export default class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.minimizers = new ChainedMap(this);
    this.splitChunks = new ChainedValueMap(this);
    this.extend([
      'minimize',
      'runtimeChunk',
      'emitOnErrors',
      'moduleIds',
      'chunkIds',
      'nodeEnv',
      'removeEmptyChunks',
      'mergeDuplicateChunks',
      'providedExports',
      'usedExports',
      'concatenateModules',
      'sideEffects',
      'mangleExports',
      'innerGraph',
      'inlineExports',
      'realContentHash',
      'avoidEntryIife',
    ]);
  }

  minimizer(name) {
    if (Array.isArray(name)) {
      throw new Error(
        'optimization.minimizer() does not support being passed an array.',
      );
    }

    return this.minimizers.getOrCompute(
      name,
      () => new Plugin(this, name, 'optimization.minimizer'),
    );
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        splitChunks: this.splitChunks.entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig()),
      }),
    );
  }

  merge(obj, omit = []) {
    if (!omit.includes('minimizer') && 'minimizer' in obj) {
      Object.keys(obj.minimizer).forEach((name) =>
        this.minimizer(name).merge(obj.minimizer[name]),
      );
    }

    return super.merge(obj, [...omit, 'minimizer']);
  }
}
