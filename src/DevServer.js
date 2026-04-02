import ChainedMap from './ChainedMap.js';

export default class extends ChainedMap {
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
    return this.clean(this.entries() || {});
  }
}
