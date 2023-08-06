import { useEffect, useMemo } from 'react';
import { useEvent } from '../useEvent';
import { throttle } from '../../utils';

export const useThrottle = <T extends (...args: any[]) => any>(fn: T) => {
  const memoizedFn = useEvent(fn);

  const throttledFn = useMemo(() => throttle((...args: Parameters<T>) => memoizedFn(...args)), []);

  useEffect(
    () => () => {
      throttledFn.cancel();
    },
    [throttledFn],
  );

  return throttledFn;
};
