import * as React from "react";

type InitialDataType<T, U> = ReadonlyArray<readonly [T, U]>;

export const useMap = <T, U>(initialData?: InitialDataType<T, U>) => {
  /** map will not reinitialize while rerender  */
  const [stateMap, _] = React.useState(() => new Map(initialData));
  const [size, setSize] = React.useState(stateMap.size);

  const set = (key: T, value: U) => {
    const res = stateMap.set(key, value);
    setSize(stateMap.size);

    return res;
  };

  const has = (key: T) => stateMap.has(key);

  const remove = (key: T) => {
    const res = stateMap.delete(key);
    setSize(stateMap.size);

    return res;
  };

  const clear = () => {
    stateMap.clear();
    setSize(0);
  };
  /** forEach has reversed params key-value */
  const map = <V>(mapper: (value: U, key: T) => V) => {
    const res: V[] = [];

    stateMap.forEach((value, key) => res.push(mapper(value, key)));

    return res;
  };

  const componentMap = React.useMemo(() => {
    /** after changing size of stateMap object below will recalculate */
    return {
      set,
      has,
      remove,
      clear,
      map,
      get size() {
        return size;
      },
    };
  }, [stateMap, size]);

  return componentMap;
};
