import React from 'react';
import { useLatest } from '../useLatest';

type WindowEvent<T extends string> = T extends keyof WindowEventMap ? WindowEventMap[T] : Event;

export function useWindowEvent<T extends string>(
  type: T,
  callback: (event: WindowEvent<T>) => void,
): void;
/** main goal - subscribe/unsubscribe on window event only once */
export function useWindowEvent(type: string, callback: (event: Event) => void) {
  /** see usePrev hook */
  const latestCb = useLatest(callback);
  /**
   * or you can use hook useEvent
   * const cb = useEvent(cb)
   */

  React.useEffect(() => {
    /** if you are using useEvent - handler no needed */
    const handler = (event: Event) => {
      /** get the updated value from mutable ref.current property */
      latestCb.current(event);
    };

    window.addEventListener(type, handler);

    return () => {
      window.removeEventListener(type, handler);
    };
    /** would change only once while mounting component */
  }, [latestCb]);
}
