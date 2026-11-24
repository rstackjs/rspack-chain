import ChainedMap from './ChainedMap.js';
import ChainedSet from './ChainedSet.js';
import Orderable from './Orderable.js';
import Use from './Use.js';
import Resolve, { cloneResolve } from './Resolve.js';
import { cloneMap, cloneSet } from './clone.js';

function toArray(arr) {
  return Array.isArray(arr) ? arr : [arr];
}

const Rule = Orderable(
  class extends ChainedMap {
    // Most rules do not configure rule-level resolution. Keep this tree lazy
    // to avoid allocating Resolve's child maps and sets for every nested rule.
    #resolve;

    constructor(parent, name, ruleType = 'rule') {
      super(parent);
      this.ruleName = name;
      this.names = [];
      this.ruleType = ruleType;
      this.ruleTypes = [];

      // rslint-disable-next-line @typescript-eslint/no-this-alias
      let rule = this;
      while (rule instanceof Rule) {
        this.names.unshift(rule.ruleName);
        this.ruleTypes.unshift(rule.ruleType);
        rule = rule.parent;
      }

      this.uses = new ChainedMap(this);
      this.include = new ChainedSet(this);
      this.exclude = new ChainedSet(this);
      this.rules = new ChainedMap(this);
      this.oneOfs = new ChainedMap(this);
      this.extend([
        'dependency',
        'descriptionData',
        'enforce',
        'extractSourceMap',
        'issuer',
        'issuerLayer',
        'layer',
        'mimetype',
        'phase',
        'parser',
        'generator',
        'resource',
        'resourceFragment',
        'resourceQuery',
        'scheme',
        'sideEffects',
        'with',
        'test',
        'type',
      ]);
    }

    get resolve() {
      this.#resolve ??= new Resolve(this);
      return this.#resolve;
    }

    set resolve(value) {
      this.#resolve = value;
    }

    use(name) {
      return this.uses.getOrCompute(name, () => new Use(this, name));
    }

    rule(name) {
      return this.rules.getOrCompute(name, () => new Rule(this, name, 'rule'));
    }

    oneOf(name) {
      return this.oneOfs.getOrCompute(
        name,
        () => new Rule(this, name, 'oneOf'),
      );
    }

    pre() {
      return this.enforce('pre');
    }

    post() {
      return this.enforce('post');
    }

    cloneFrom(source) {
      if (source === this) return this;
      return this.#cloneFrom(source, {});
    }

    #cloneFrom(source, context) {
      const children = {};
      for (const key of ['uses', 'rules', 'oneOfs']) {
        const entries = new Map();
        for (const [name, child] of source[key].store) {
          let cloned;
          if (key === 'uses') {
            cloned = new Use(this, name);
            cloneMap(child.store, context, cloned.store);
          } else {
            cloned = new Rule(this, name, key === 'rules' ? 'rule' : 'oneOf');
            cloned.#cloneFrom(child, context);
          }
          cloned.__before = child.__before;
          cloned.__after = child.__after;
          entries.set(name, cloned);
        }
        children[key] = entries;
      }
      const resolve = source.#resolve
        ? cloneResolve(source.#resolve, this, context)
        : undefined;

      // Clone descendants before updating a target that may be inside the source.
      cloneMap(source.store, context, this.store);
      cloneSet(source.include.store, context, this.include.store);
      cloneSet(source.exclude.store, context, this.exclude.store);
      this.uses.store = children.uses;
      this.rules.store = children.rules;
      this.oneOfs.store = children.oneOfs;
      this.#resolve = resolve;
      return this;
    }

    toConfig() {
      const config = this.clean(
        Object.assign(this.entries() || {}, {
          include: this.include.values(),
          exclude: this.exclude.values(),
          rules: this.rules.values().map((rule) => rule.toConfig()),
          oneOf: this.oneOfs.values().map((oneOf) => oneOf.toConfig()),
          use: this.uses.values().map((use) => use.toConfig()),
          // Do not access the getter here, or serializing an unused rule would
          // instantiate the empty Resolve tree that lazy creation avoids.
          resolve: this.#resolve?.toConfig(),
        }),
      );

      Object.defineProperties(config, {
        __ruleNames: { value: this.names },
        __ruleTypes: { value: this.ruleTypes },
      });

      return config;
    }

    merge(obj, omit = []) {
      if (!omit.includes('include') && 'include' in obj) {
        this.include.merge(toArray(obj.include));
      }

      if (!omit.includes('exclude') && 'exclude' in obj) {
        this.exclude.merge(toArray(obj.exclude));
      }

      if (!omit.includes('use') && 'use' in obj) {
        Object.keys(obj.use).forEach((name) =>
          this.use(name).merge(obj.use[name]),
        );
      }

      if (!omit.includes('rules') && 'rules' in obj) {
        Object.keys(obj.rules).forEach((name) =>
          this.rule(name).merge(obj.rules[name]),
        );
      }

      if (!omit.includes('oneOf') && 'oneOf' in obj) {
        Object.keys(obj.oneOf).forEach((name) =>
          this.oneOf(name).merge(obj.oneOf[name]),
        );
      }

      if (!omit.includes('resolve') && 'resolve' in obj) {
        this.resolve.merge(obj.resolve);
      }

      if (!omit.includes('test') && 'test' in obj) {
        this.test(
          obj.test instanceof RegExp || typeof obj.test === 'function'
            ? obj.test
            : new RegExp(obj.test),
        );
      }

      return super.merge(obj, [
        ...omit,
        'include',
        'exclude',
        'use',
        'rules',
        'oneOf',
        'resolve',
        'test',
      ]);
    }
  },
);

export default Rule;
