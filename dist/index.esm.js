import * as React from 'react';

/** simple store like React.Context */
class OptimizedContext {
    subscribers = [];
    state;
    constructor(initialState) {
        this.state = initialState;
    }
    /** get current state */
    getState = () => {
        return this.state;
    };
    /** function to update state */
    update = (state) => {
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
    subscribe = (cb) => {
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
function createOptimizedContext() {
    const Context = React.createContext(null);
    const Provider = ({ children, initialState, }) => {
        const store = React.useMemo(() => new OptimizedContext(initialState), []);
        return (React.createElement(Context.Provider, { value: store },
            " ",
            children,
            " "));
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
    const useStoreSelector = (selector) => {
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

function usePrevious(value) {
    const prevValue = React.useRef(null);
    React.useEffect(() => {
        prevValue.current = value;
    }, [value]);
    return prevValue;
}

function useCustomCompare(value, areEqual) {
    const changeRef = React.useRef(0);
    const prevValue = usePrevious(value).current;
    if (changeRef.current === 0 || !areEqual(prevValue, value)) {
        changeRef.current++;
    }
    return changeRef.current;
}

const debounce = (fn, ms) => {
    let timeoutId = undefined;
    const debounced = (...args) => {
        if (typeof timeoutId === 'number') {
            clearTimeout(timeoutId);
        }
        // @ts-ignore
        timeoutId = setTimeout(() => {
            timeoutId = undefined;
            fn.apply(null, args);
        }, ms);
    };
    debounced.cancel = () => {
        if (typeof timeoutId !== 'number') {
            return;
        }
        clearTimeout(timeoutId);
    };
    return debounced;
};

const throttle = (fn) => {
    let id = null;
    const throttled = (...args) => {
        if (typeof id === 'number') {
            return;
        }
        id = requestAnimationFrame(() => {
            fn.apply(null, args);
            id = null;
        });
    };
    throttled.cancel = () => {
        if (typeof id !== 'number') {
            return;
        }
        cancelAnimationFrame(id);
    };
    return throttled;
};

const isObject = (value) => (typeof value === 'object' || typeof value === 'function') && value !== null;
const isPromise = (value) => {
    const isObj = isObject(value);
    const isInstanceOfPromise = value instanceof Promise;
    const isThenable = value.then && value.then === 'function';
    const isCatchable = value.catch && value.catch === 'function';
    return isInstanceOfPromise || (isObj && isThenable && isCatchable);
};

function tryExecute(value, defaultValue) {
    const onCatch = (err) => {
        return typeof defaultValue === 'function'
            ? defaultValue(err)
            : defaultValue;
    };
    try {
        const unwrappedValue = typeof value === 'function' ? value() : value;
        if (isPromise(unwrappedValue)) {
            return new Promise((resolve) => {
                return (unwrappedValue
                    // @ts-ignore
                    .then((value) => {
                    resolve(value);
                })
                    // @ts-ignore
                    .catch((err) => {
                    resolve(onCatch(err));
                }));
            });
        }
        return unwrappedValue;
    }
    catch (err) {
        return onCatch(err);
    }
}

function useEvent(fn) {
    const fnRef = React.useRef(fn);
    React.useLayoutEffect(() => {
        fnRef.current = fn;
    }, [fn]);
    const eventCb = React.useCallback((...args) => fnRef.current.apply(null, args), [fnRef]);
    return eventCb;
}

const useDebounce = (fn, ms) => {
    const memoizedFn = useEvent(fn);
    const debouncedFn = React.useMemo(() => debounce((...args) => {
        memoizedFn(...args);
    }, ms), [ms]);
    React.useEffect(() => () => {
        debouncedFn.cancel();
    }, [debouncedFn]);
    return debouncedFn;
};

const useDebouncedEffect = (cb, deps, ms) => {
    const cleanUpFn = React.useRef();
    const effectCb = useDebounce(() => {
        cleanUpFn.current = cb();
    }, ms);
    React.useEffect(() => {
        effectCb();
        return () => {
            if (typeof cleanUpFn.current === 'undefined') {
                return;
            }
            cleanUpFn.current();
            cleanUpFn.current = undefined;
        };
    }, deps);
};

function useIsMounted() {
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

const useLatest = (value) => {
    const ref = React.useRef(value);
    /** sync commit react change to DOM */
    React.useLayoutEffect(() => {
        ref.current = value;
    });
    return ref;
};

/**
 * for manage simple outside click just use hook useOutSideClick.
 * This manager manage deep nested popups/portals event triggers
 * and save events bubbling hierarchy
 */
class LayerManager {
    children = [];
    elementRef;
    triggerRef;
    constructor({ elementRef, triggerRef }) {
        this.elementRef = elementRef;
        this.triggerRef = triggerRef;
    }
    registerChild = (child) => {
        this.children.push(child);
        return () => {
            const index = this.children.indexOf(child);
            if (index === -1) {
                return;
            }
            this.children.splice(index, 1);
        };
    };
    isOutsideClick = (target) => {
        if (!this.elementRef.current || !(target instanceof Node)) {
            return true;
        }
        const ignoreElements = [this.elementRef.current];
        if (this.triggerRef?.current) {
            ignoreElements.push(this.triggerRef.current);
        }
        const clickedInside = ignoreElements.some((element) => element.contains(target));
        if (clickedInside) {
            return false;
        }
        const clickOutsideOfChildLayers = this.children.every((child) => child.isOutsideClick(target));
        if (clickOutsideOfChildLayers) {
            return true;
        }
        return false;
    };
}

const LayerContext = React.createContext(null);
const useLayerManager = ({ elementRef, onOutsideClick, outsideClickEnabled, triggerRef, }) => {
    const parentLayer = React.useContext(LayerContext);
    const layer = React.useMemo(() => new LayerManager({
        elementRef,
        triggerRef,
    }), []);
    React.useEffect(() => {
        if (!parentLayer) {
            return;
        }
        return parentLayer.registerChild(layer);
    }, []);
    useEvent(onOutsideClick);
    React.useEffect(() => {
        if (!outsideClickEnabled) {
            return;
        }
    }, [layer, outsideClickEnabled]);
    const renderLayer = (children) => (React.createElement(LayerContext.Provider, { value: layer }, children));
    return { renderLayer };
};

const useMap = (initialData) => {
    /** map will not reinitialize while rerender  */
    const [stateMap, _] = React.useState(() => new Map(initialData));
    const [size, setSize] = React.useState(stateMap.size);
    const set = (key, value) => {
        const res = stateMap.set(key, value);
        setSize(stateMap.size);
        return res;
    };
    const has = (key) => stateMap.has(key);
    const remove = (key) => {
        const res = stateMap.delete(key);
        setSize(stateMap.size);
        return res;
    };
    const clear = () => {
        stateMap.clear();
        setSize(0);
    };
    /** forEach has reversed params key-value */
    const map = (mapper) => {
        const res = [];
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

const useOutsideClick = ({ elementRef, onOutsideClick, triggerRef, enabled = true, }) => {
    const memoizedEvent = useEvent(onOutsideClick);
    React.useEffect(() => {
        if (!enabled) {
            return;
        }
        const handler = (e) => {
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

const useResizeObserver = (onResize) => {
    const observerRef = React.useRef(null);
    const attachResizeObserver = React.useCallback((element) => {
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(element);
        observerRef.current = resizeObserver;
    }, [onResize]);
    const detachResizeObserver = React.useCallback(() => {
        observerRef.current?.disconnect();
    }, []);
    const refCb = React.useCallback((element) => {
        if (element) {
            attachResizeObserver(element);
        }
        else {
            detachResizeObserver();
        }
    }, [attachResizeObserver, detachResizeObserver]);
    return refCb;
};

const useSet = (initialData) => {
    /** set will not reinitialize while rerender  */
    const [set, _] = React.useState(() => new Set(initialData));
    const [size, setSize] = React.useState(set.size);
    const add = (value) => {
        const res = set.add(value);
        setSize(set.size);
        return res;
    };
    const has = (value) => set.has(value);
    const remove = (value) => {
        const res = set.delete(value);
        setSize(set.size);
        return res;
    };
    const clear = () => {
        set.clear();
        setSize(0);
    };
    const map = (mapper) => {
        const res = [];
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

const useThrottle = (fn) => {
    const memoizedFn = useEvent(fn);
    const throttledFn = React.useMemo(() => throttle((...args) => memoizedFn(...args)), []);
    React.useEffect(() => () => {
        throttledFn.cancel();
    }, [throttledFn]);
    return throttledFn;
};

/** main goal - subscribe/unsubscribe on window event only once */
function useWindowEvent(type, callback) {
    /** see usePrev hook */
    const latestCb = useLatest(callback);
    /**
     * or you can use hook useEvent
     * const cb = useEvent(cb)
     */
    React.useEffect(() => {
        /** if you are using useEvent - handler no needed */
        const handler = (event) => {
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

const useBoolean = (initialValue = false) => {
    const [value, setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => setValue((prev) => !prev), []);
    const setTrue = React.useCallback(() => setValue(true), []);
    const setFalse = React.useCallback(() => setValue(false), []);
    return React.useMemo(() => ({ value, toggle, setTrue, setFalse }), [value, toggle, setTrue, setFalse]);
};

const useStatusCallback = (callback) => {
    const { value: isPending, setTrue: startTransition, setFalse: endTransition } = useBoolean();
    const wrappedCallback = React.useCallback(async (...args) => {
        startTransition();
        try {
            await callback(...args);
        }
        finally {
            endTransition();
        }
    }, [callback, endTransition, startTransition]);
    return React.useMemo(() => ({
        isPending,
        wrappedCallback,
    }), [wrappedCallback, isPending]);
};

class EventBus {
    callbacks;
    constructor() {
        this.callbacks = {};
    }
    getEventCallbacks = (event) => {
        if (!event || !this.callbacks[event]) {
            return [];
        }
        return this.callbacks[event];
    };
    getEvents = () => {
        return Object.keys(this.callbacks);
    };
    registerEvent(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push({
            subscription: callback,
        });
    }
    unregisterEventCallback(event, callback) {
        const events = this.callbacks[event];
        if (!events?.length) {
            return;
        }
        this.callbacks[event] = events.filter(({ subscription }) => subscription !== callback);
    }
    unregisterEvent(event) {
        if (!this.callbacks[event])
            return;
        this.callbacks[event] = [];
    }
    publish(...args) {
        const arity = args.length;
        if (!arity) {
            return;
        }
        const event = args[0];
        const argsToInvoke = arity >= 2 ? args.slice(1) : [];
        if (!this.callbacks[event]) {
            return;
        }
        this.callbacks[event].forEach(cb => {
            cb.subscription(...argsToInvoke);
        });
    }
}

export { EventBus, createOptimizedContext, debounce, throttle, tryExecute, useBoolean, useCustomCompare, useDebounce, useDebouncedEffect, useEvent, useIsMounted, useLatest, useLayerManager, useMap, useOutsideClick, usePrevious, useResizeObserver, useSet, useStatusCallback, useThrottle, useWindowEvent };
//# sourceMappingURL=index.esm.js.map
