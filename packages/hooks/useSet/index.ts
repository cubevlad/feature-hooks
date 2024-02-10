import React from "react";

export const useSet = <T>(initialData?: Iterable<T>) => {
  /** set will not reinitialize while rerender  */
  const [set, _] = React.useState(() => new Set(initialData));
  const [size, setSize] = React.useState(set.size);

  const add = (value: T) => {
    const res = set.add(value);
    setSize(set.size);

    return res;
  };

  const has = (value: T) => set.has(value);

  const remove = (value: T) => {
    const res = set.delete(value);
    setSize(set.size);

    return res;
  };

  const clear = () => {
    set.clear();
    setSize(0);
  };

  const map = <U>(mapper: (value: T) => U) => {
    const res: U[] = [];

    set.forEach((item) => res.push(mapper(item)));

    return res;
  };

  const componentSet = React.useMemo(() => {
    /** after changing size of set object will recalculate */
    return {
      add,
      has,
      remove,
      clear,
      map,
      get size() {
        return size;
      },
    };
  }, [set, size]);

  return componentSet;
};
