import { useRef, useCallback } from 'react';

export const useResizeObserver = (onResize: ResizeObserverCallback) => {
  const observerRef = useRef<ResizeObserver | null>(null);

  const attachResizeObserver = useCallback(
    (element: HTMLElement) => {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(element);
      observerRef.current = resizeObserver;
    },
    [onResize],
  );

  const detachResizeObserver = useCallback(() => {
    observerRef.current?.disconnect();
  }, []);

  const refCb = useCallback(
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
