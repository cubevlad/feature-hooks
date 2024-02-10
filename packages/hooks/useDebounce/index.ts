import React from 'react';
import { debounce } from '../../utils';
import { useEvent } from '../useEvent';

export const useDebounce = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  const memoizedFn = useEvent(fn);

  const debouncedFn = React.useMemo(
    () =>
      debounce((...args: Parameters<T>) => {
        memoizedFn(...args);
      }, ms),
    [ms],
  );

  React.useEffect(
    () => () => {
      debouncedFn.cancel();
    },
    [debouncedFn],
  );

  return debouncedFn;
};
