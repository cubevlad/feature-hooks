import React from "react";

/** simple store like React.Context */
class OptimizedContext<T> {
  private subscribers: (() => void)[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }
  /** get current state */
  getState = () => {
    return this.state;
  };
  /** function to update state */
  update = (state: Partial<T>) => {
    if (!state) {
      return;
    }

    this.state = {
      ...this.state,
      ...state,
    };

    this.subscribers.forEach((cb) => {
      cb();
    });
  };

  /** subscribe to store
   * @param cb - callback to invoke when update
   * @returns function to unsubscribe from store
   */
  subscribe = (cb: () => void) => {
    this.subscribers.push(cb);

    return () => {
      const index = this.subscribers.indexOf(cb);

      if (index === -1) {
        return;
      }

      this.subscribers.splice(index, 1);
    };
  };
}

export function createOptimizedContext<T>() {
  const Context = React.createContext<OptimizedContext<T> | null>(null);

  const Provider = ({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState: T;
  }) => {
    const store = React.useMemo(() => new OptimizedContext(initialState), []);

    return <Context.Provider value={store}> {children} </Context.Provider>;
  };

  const useStore = () => {
    const store = React.useContext(Context);

    if (!store) {
      throw new Error("You should wrap this component to Context.Provider");
    }

    return store;
  };

  const useStoreUpdate = () => {
    const store = useStore();

    return store.update;
  };

  const useStoreSelector = <U,>(selector: (state: T) => U): U => {
    const store = useStore();
    const [state, setState] = React.useState(() => selector(store.getState()));
    const stateRef = React.useRef(state);
    const selectorRef = React.useRef(selector);

    React.useLayoutEffect(() => {
      selectorRef.current = selector;
      stateRef.current = state;
    }, []);

    React.useEffect(() => {
      return store.subscribe(() => {
        const currentState = selectorRef.current(store.getState());

        if (stateRef.current === currentState) {
          return;
        }

        setState(state);
      });
    }, [store]);

    return state;
  };

  return {
    Provider,
    useStoreUpdate,
    useStoreSelector,
  };
}
