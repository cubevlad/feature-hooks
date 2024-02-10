import React from "react";

export const useLatest = <T>(value: T) => {
  const ref = React.useRef(value);

  /** sync commit react change to DOM */
  React.useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
};
