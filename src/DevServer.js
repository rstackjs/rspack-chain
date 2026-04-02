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

  clear() {
    this.allowedHosts.clear();
    return super.clear();
  }

  delete(key) {
    if (key === 'allowedHosts') {
      this.allowedHosts.clear();
    }

    return super.delete(key);
  }

  set(key, value) {
    if (key !== 'allowedHosts') {
      return super.set(key, value);
    }

    this.allowedHosts.clear();

    if (Array.isArray(value)) {
      this.allowedHosts.merge(value);
      return super.delete(key);
    }

    return super.set(key, value);
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

      if (allowedHosts !== undefined) {
        this.set('allowedHosts', allowedHosts);
      }
    }

    return super.merge(obj, [...omit, 'allowedHosts']);
  }
}
