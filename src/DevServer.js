import ChainedValueMap from './ChainedValueMap.js';

export default class extends ChainedValueMap {
  constructor(parent) {
    super(parent);

    this.extend([
      'allowedHosts',
      'app',
      'client',
      'compress',
      'devMiddleware',
      'headers',
      'host',
      'historyApiFallback',
      'hot',
      'ipc',
      'liveReload',
      'onListening',
      'open',
      'port',
      'proxy',
      'server',
      'setupExitSignals',
      'setupMiddlewares',
      'static',
      'watchFiles',
      'webSocketServer',
    ]);
  }

  toConfig() {
    const config = this.entries();

    return config === false ? false : this.clean(config || {});
  }
}
