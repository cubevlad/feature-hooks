import { useEvent } from '../useEvent';
import { throttle } from '../../utils';
import React from 'react';

export const useThrottle = <T extends (...args: any[]) => any>(fn: T) => {
  const memoizedFn = useEvent(fn);

  const throttledFn = React.useMemo(() => throttle((...args: Parameters<T>) => memoizedFn(...args)), []);

  React.useEffect(
    () => () => {
      throttledFn.cancel();
    },
    [throttledFn],
  );

  return throttledFn;
};
