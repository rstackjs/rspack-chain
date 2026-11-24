function cloneValue(value, context) {
  if (value === null || typeof value !== 'object') return value;
  const seen = (context.seen ??= new WeakMap());
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
    const clonedValue = cloneValue(value[key], context);
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

export function cloneMap(source, context, cloned = new Map()) {
  if (cloned.size) cloned.clear();
  for (const [key, value] of source) {
    cloned.set(
      key,
      value !== null && typeof value === 'object'
        ? cloneValue(value, context)
        : value,
    );
  }
  return cloned;
}

export function cloneSet(source, context, cloned = new Set()) {
  if (cloned.size) cloned.clear();
  for (const value of source) {
    cloned.add(cloneValue(value, context));
  }
  return cloned;
}
