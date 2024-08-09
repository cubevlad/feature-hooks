import * as React from "react";

export function useIsMounted() {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
    /** should trigger only once */
  }, []);

  return isMounted;
}
