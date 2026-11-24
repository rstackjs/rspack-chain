import merge from 'deepmerge';
import ChainedMap from './ChainedMap.js';
import Orderable from './Orderable.js';

function cloneValue(value, seen) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags);
    cloned.lastIndex = value.lastIndex;
    seen.set(value, cloned);
    return cloned;
  }

  const prototype = Object.getPrototypeOf(value);
  if (
    !Array.isArray(value) &&
    prototype !== Object.prototype &&
    prototype !== null
  ) {
    return value;
  }

  const cloned = Array.isArray(value)
    ? new Array(value.length)
    : Object.create(prototype);
  seen.set(value, cloned);
  for (const key of Object.keys(value)) {
    const clonedValue = cloneValue(value[key], seen);
    if (key === '__proto__') {
      Object.defineProperty(cloned, key, {
        value: clonedValue,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      cloned[key] = clonedValue;
    }
  }
  return cloned;
}

export default Orderable(
  class extends ChainedMap {
    constructor(parent, name) {
      super(parent);
      this.name = name;
      this.extend(['ident', 'loader', 'options', 'parallel']);
    }

    tap(f) {
      this.options(f(this.get('options')));
      return this;
    }

    cloneFrom(source) {
      if (source === this) return this;

      const seen = new WeakMap();
      const store = new Map();
      for (const [key, value] of source.store) {
        store.set(key, cloneValue(value, seen));
      }
      this.store = store;
      return this;
    }

    merge(obj, omit = []) {
      if (!omit.includes('loader') && 'loader' in obj) {
        this.loader(obj.loader);
      }

      if (!omit.includes('options') && 'options' in obj) {
        this.options(merge(this.store.get('options') || {}, obj.options));
      }

      return super.merge(obj, [...omit, 'loader', 'options']);
    }

    toConfig() {
      const config = this.clean(this.entries() || {});

      Object.defineProperties(config, {
        __useName: { value: this.name },
        __ruleNames: { value: this.parent && this.parent.names },
        __ruleTypes: { value: this.parent && this.parent.ruleTypes },
      });

      return config;
    }
  },
);
