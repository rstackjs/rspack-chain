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

export function cloneMap(source, seen) {
  const cloned = new Map();
  for (const [key, value] of source) {
    cloned.set(key, cloneValue(value, seen));
  }
  return cloned;
}

export function cloneSet(source, seen) {
  const cloned = new Set();
  for (const value of source) {
    cloned.add(cloneValue(value, seen));
  }
  return cloned;
}
