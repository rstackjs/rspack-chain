import merge from 'deepmerge';
import ChainedMap from './ChainedMap.js';
import Orderable from './Orderable.js';

function cloneValue(value, seen = new WeakMap()) {
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
    Object.defineProperty(cloned, key, {
      value: cloneValue(value[key], seen),
      enumerable: true,
      configurable: true,
      writable: true,
    });
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

    cloneFrom(source, { preserveOrder = false } = {}) {
      if (source === this) return this;

      const seen = new WeakMap();
      this.store = new Map(
        Array.from(source.store, ([key, value]) => [
          key,
          cloneValue(value, seen),
        ]),
      );
      if (preserveOrder) {
        this.__before = source.__before;
        this.__after = source.__after;
      }
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
