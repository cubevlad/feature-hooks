import React from 'react';
import { usePrevious } from '../usePrevious';

export function useCustomCompare<T>(
  value: T,
  areEqual: (prevValue: T, currentValue: T) => boolean,
) {
  const changeRef = React.useRef(0);
  const prevValue = usePrevious(value).current;

  if (changeRef.current === 0 || !areEqual(prevValue as T, value)) {
    changeRef.current++;
  }

  return changeRef.current;
}
