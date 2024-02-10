import React from 'react';
import { useDebounce } from '../useDebounce';

export const useDebouncedEffect = (cb: React.EffectCallback, deps: React.DependencyList, ms: number) => {
  const cleanUpFn = React.useRef<(() => void) | void>();

  const effectCb = useDebounce(() => {
    cleanUpFn.current = cb();
  }, ms);

  React.useEffect(() => {
    effectCb();

    return () => {
      if (typeof cleanUpFn.current === 'undefined') {
        return;
      }

      cleanUpFn.current();
      cleanUpFn.current = undefined;
    };
  }, deps);
};
