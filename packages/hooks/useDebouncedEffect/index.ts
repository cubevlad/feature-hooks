import { useRef, type DependencyList, type EffectCallback, useEffect } from 'react';
import { useDebounce } from '../useDebounce';

export const useDebouncedEffect = (cb: EffectCallback, deps: DependencyList, ms: number) => {
  const cleanUpFn = useRef<(() => void) | void>();

  const effectCb = useDebounce(() => {
    cleanUpFn.current = cb();
  }, ms);

  useEffect(() => {
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
