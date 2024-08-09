import  * as React from 'react'

import { useBoolean } from '../useBoolean'

export const useStatusCallback = <T extends (...args: any[]) => any>(callback: T) => {
  const { value: isPending, setTrue: startTransition, setFalse: endTransition } = useBoolean()

  const wrappedCallback = React.useCallback(
    async (...args: Parameters<T>) => {
      startTransition()
      try {
        await callback(...args)
      } finally {
        endTransition()
      }
    },
    [callback, endTransition, startTransition]
  )

  return React.useMemo(
    () => ({
      isPending,
      wrappedCallback,
    }),
    [wrappedCallback, isPending]
  )
}
