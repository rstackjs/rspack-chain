import ChainedMap from './ChainedMap.js';
import ChainedSet from './ChainedSet.js';

export default class extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.allowedHosts = new ChainedSet(this);

    this.extend([
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
    return this.clean({
      allowedHosts: this.allowedHosts.values(),
      ...(this.entries() || {}),
    });
  }

  merge(obj, omit = []) {
    if (!omit.includes('allowedHosts') && 'allowedHosts' in obj) {
      const { allowedHosts } = obj;

      if (Array.isArray(allowedHosts)) {
        this.delete('allowedHosts');
        this.allowedHosts.merge(allowedHosts);
      } else {
        this.allowedHosts.clear();
        this.set('allowedHosts', allowedHosts);
      }
    }

    return super.merge(obj, ['allowedHosts']);
  }
}
