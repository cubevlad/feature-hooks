import * as React from 'react'

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue)

  const toggle = React.useCallback(() => setValue((prev) => !prev), [])
  const setTrue = React.useCallback(() => setValue(true), [])
  const setFalse = React.useCallback(() => setValue(false), [])

  return React.useMemo(() => ({ value, toggle, setTrue, setFalse }), [value, toggle, setTrue, setFalse])
}
