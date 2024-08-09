const isObject = (value: any) =>
    (typeof value === 'object' || typeof value === 'function') && value !== null;

export const isPromise = (value: any) => {
  const isObj = isObject(value);
  const isInstanceOfPromise = value instanceof Promise;
  const isThenable =  value.then && value.then === 'function';
  const isCatchable = value.catch && value.catch === 'function';

  return isInstanceOfPromise || (isObj && isThenable && isCatchable);
}