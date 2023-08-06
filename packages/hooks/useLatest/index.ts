import { useRef, useLayoutEffect } from 'react';

export const useLatest = <T>(value: T) => {
  const ref = useRef(value);

  /** sync commit react change to DOM */
  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
};
