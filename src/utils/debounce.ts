export const debounce = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  let timeoutId: number | undefined = undefined;

  const debounced = (...args: Parameters<T>) => {
    if (typeof timeoutId === 'number') {
      clearTimeout(timeoutId);
    }

    // @ts-ignore
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn.apply(null, args);
    }, ms);
  };

  debounced.cancel = () => {
    if (typeof timeoutId !== 'number') {
      return;
    }
    clearTimeout(timeoutId);
  };

  return debounced;
};
