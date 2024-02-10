import React from "react";

export function usePrevious<T>(value: T) {
  const prevValue = React.useRef<T | null>(null);

  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue;
}
