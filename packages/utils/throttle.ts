export const throttle = <T extends (...args: any[]) => any>(fn: T) => {
  let id: number | null = null;

  const throttled = (...args: Parameters<T>) => {
    if (typeof id === 'number') {
      return;
    }

    id = requestAnimationFrame(() => {
      fn.apply(null, args);
      id = null;
    });
  };

  throttled.cancel = () => {
    if (typeof id !== 'number') {
      return;
    }
    cancelAnimationFrame(id);
  };

  return throttled;
};
