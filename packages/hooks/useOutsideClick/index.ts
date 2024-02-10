import React from 'react';
import { useEvent } from '../useEvent';

type UseOutsideClickOptions = {
  elementRef: React.RefObject<HTMLElement>;
  // we should ignore click on component to prevent trigger on outside click
  triggerRef?: React.RefObject<HTMLElement>;
  onOutsideClick: (e: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
};

export const useOutsideClick = ({
  elementRef,
  onOutsideClick,
  triggerRef,
  enabled = true,
}: UseOutsideClickOptions) => {
  const memoizedEvent = useEvent(onOutsideClick);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!elementRef.current) {
        return;
      }

      const ignoreElements = [elementRef.current];

      if (triggerRef?.current) {
        ignoreElements.push(triggerRef.current);
      }

      if (!ignoreElements.some((element) => element.contains(target))) {
        memoizedEvent(e);
      }
    };

    // for React v < 18 use click event
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [memoizedEvent]);
};
