import ChainedMap from './ChainedMap.js';
import ChainedSet from './ChainedSet.js';
import { cloneMap, cloneSet } from './clone.js';

const childMaps = ['alias', 'fallback', 'byDependency', 'extensionAlias'];
const childSets = [
  'aliasFields',
  'conditionNames',
  'descriptionFiles',
  'extensions',
  'mainFields',
  'mainFiles',
  'exportsFields',
  'importsFields',
  'restrictions',
  'roots',
  'modules',
];

export default class Resolve extends ChainedMap {
  constructor(parent) {
    super(parent);

    childMaps.forEach((key) => {
      this[key] = new ChainedMap(this);
    });
    childSets.forEach((key) => {
      this[key] = new ChainedSet(this);
    });

    this.extend([
      'enforceExtension',
      'fullySpecified',
      'pnp',
      'symlinks',
      'preferRelative',
      'preferAbsolute',
      'tsConfig',
    ]);
  }

  get(key) {
    if (childMaps.includes(key)) {
      return this[key].entries();
    }
    if (childSets.includes(key)) {
      return this[key].values();
    }
    return super.get(key);
  }

  toConfig() {
    const config = Object.assign(this.entries() || {});

    childMaps.forEach((key) => {
      config[key] = this[key].entries();
    });
    childSets.forEach((key) => {
      config[key] = this[key].values();
    });

    return this.clean(config);
  }

  merge(obj, omit = []) {
    const omissions = [...childMaps, ...childSets];

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions]);
  }
}

// Copy rule-level resolution without serializing its chain nodes.
export function cloneResolve(source, parent, seen) {
  const cloned = new Resolve(parent);
  cloned.store = cloneMap(source.store, seen);
  for (const key of childMaps) {
    cloned[key].store = cloneMap(source[key].store, seen);
  }
  for (const key of childSets) {
    cloned[key].store = cloneSet(source[key].store, seen);
  }
  return cloned;
}
