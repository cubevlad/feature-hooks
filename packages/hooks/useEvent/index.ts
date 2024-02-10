import React from "react";

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = React.useRef(fn);

  React.useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const eventCb = React.useCallback((...args: Parameters<T>) => fnRef.current.apply(null, args), [fnRef]);

  return eventCb;
}
