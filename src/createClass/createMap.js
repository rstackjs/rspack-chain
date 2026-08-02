import merge from 'deepmerge';

export default function createMap(superClass) {
  return class extends superClass {
    constructor(...args) {
      super(...args);
      this.store = new Map();
    }

    extend(methods) {
      this.shorthands = methods;
      methods.forEach((method) => {
        this[method] = (value) => this.set(method, value);
      });
      return this;
    }

    clear() {
      this.store.clear();
      return this;
    }

    delete(key) {
      this.store.delete(key);
      return this;
    }

    /**
     * Builds an object representation of the store and resolves the key order
     * from `__before` and `__after` hints attached by Orderable.
     */
    order() {
      const entries = {};

      for (const [key, value] of this.store) {
        entries[key] = value;
      }

      const names = Object.keys(entries);
      const order = names.slice();

      names.forEach((name) => {
        if (!entries[name]) {
          return;
        }

        const { __before, __after } = entries[name];

        if (__before && order.includes(__before)) {
          order.splice(order.indexOf(name), 1);
          order.splice(order.indexOf(__before), 0, name);
        } else if (__after && order.includes(__after)) {
          order.splice(order.indexOf(name), 1);
          order.splice(order.indexOf(__after) + 1, 0, name);
        }
      });

      return { entries, order };
    }

    /**
     * Converts the store to a plain object. Ordering hints do not affect the
     * key-value mapping, so they do not need to be resolved here.
     */
    entries() {
      if (!this.store.size) {
        return undefined;
      }

      const entries = {};
      for (const [key, value] of this.store) {
        entries[key] = value;
      }
      return entries;
    }

    /**
     * Returns values in insertion order, resolving explicit ordering only when
     * a value contains an `__before` or `__after` hint.
     */
    values() {
      const values = [];

      for (const value of this.store.values()) {
        if (value?.__before || value?.__after) {
          const { entries, order } = this.order();
          return order.map((name) => entries[name]);
        }

        values.push(value);
      }

      return values;
    }

    get(key) {
      return this.store.get(key);
    }

    getOrCompute(key, fn) {
      if (!this.has(key)) {
        this.set(key, fn());
      }
      return this.get(key);
    }

    has(key) {
      return this.store.has(key);
    }

    set(key, value) {
      this.store.set(key, value);
      return this;
    }

    merge(obj, omit = []) {
      Object.keys(obj).forEach((key) => {
        if (omit.includes(key)) {
          return;
        }

        const value = obj[key];

        if (
          (!Array.isArray(value) && typeof value !== 'object') ||
          value === null ||
          !this.has(key)
        ) {
          this.set(key, value);
        } else {
          this.set(key, merge(this.get(key), value));
        }
      });

      return this;
    }

    clean(obj) {
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];

        if (value === undefined) {
          return acc;
        }

        if (Array.isArray(value) && !value.length) {
          return acc;
        }

        if (
          Object.prototype.toString.call(value) === '[object Object]' &&
          !Object.keys(value).length
        ) {
          return acc;
        }

        acc[key] = value;

        return acc;
      }, {});
    }

    when(
      condition,
      whenTruthy = Function.prototype,
      whenFalsy = Function.prototype,
    ) {
      if (condition) {
        whenTruthy(this);
      } else {
        whenFalsy(this);
      }

      return this;
    }
  };
}
