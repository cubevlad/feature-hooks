import * as React from "react";

export const useResizeObserver = (onResize: ResizeObserverCallback) => {
  const observerRef = React.useRef<ResizeObserver | null>(null);

  const attachResizeObserver = React.useCallback(
    (element: HTMLElement) => {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(element);
      observerRef.current = resizeObserver;
    },
    [onResize],
  );

  const detachResizeObserver = React.useCallback(() => {
    observerRef.current?.disconnect();
  }, []);

  const refCb = React.useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        attachResizeObserver(element);
      } else {
        detachResizeObserver();
      }
    },
    [attachResizeObserver, detachResizeObserver],
  );

  return refCb;
};
