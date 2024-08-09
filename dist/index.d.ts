import * as React from 'react';

declare function createOptimizedContext<T>(): {
    Provider: ({ children, initialState, }: {
        children: React.ReactNode;
        initialState: T;
    }) => React.JSX.Element;
    useStoreUpdate: () => (state: Partial<T>) => void;
    useStoreSelector: <U>(selector: (state: T) => U) => U;
};

declare function useCustomCompare<T>(value: T, areEqual: (prevValue: T, currentValue: T) => boolean): number;

declare const useDebounce: <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};

declare const useDebouncedEffect: (cb: React.EffectCallback, deps: React.DependencyList, ms: number) => void;

declare function useEvent<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => any;

declare function useIsMounted(): React.MutableRefObject<boolean>;

declare const useLatest: <T>(value: T) => React.MutableRefObject<T>;

type UseLayerManagerProps = {
    elementRef: React.RefObject<HTMLElement>;
    triggerRef?: React.RefObject<HTMLElement>;
    outsideClickEnabled?: boolean;
    onOutsideClick: (event: MouseEvent | TouchEvent) => void;
};
declare const useLayerManager: ({ elementRef, onOutsideClick, outsideClickEnabled, triggerRef, }: UseLayerManagerProps) => {
    renderLayer: (children: React.ReactNode) => React.JSX.Element;
};

type InitialDataType<T, U> = ReadonlyArray<readonly [T, U]>;
declare const useMap: <T, U>(initialData?: InitialDataType<T, U>) => {
    set: (key: T, value: U) => Map<T, U>;
    has: (key: T) => boolean;
    remove: (key: T) => boolean;
    clear: () => void;
    map: <V>(mapper: (value: U, key: T) => V) => V[];
    readonly size: number;
};

type UseOutsideClickOptions = {
    elementRef: React.RefObject<HTMLElement>;
    triggerRef?: React.RefObject<HTMLElement>;
    onOutsideClick: (e: MouseEvent | TouchEvent) => void;
    enabled?: boolean;
};
declare const useOutsideClick: ({ elementRef, onOutsideClick, triggerRef, enabled, }: UseOutsideClickOptions) => void;

declare function usePrevious<T>(value: T): React.MutableRefObject<T | null>;

declare const useResizeObserver: (onResize: ResizeObserverCallback) => (element: HTMLElement | null) => void;

declare const useSet: <T>(initialData?: Iterable<T>) => {
    add: (value: T) => Set<T>;
    has: (value: T) => boolean;
    remove: (value: T) => boolean;
    clear: () => void;
    map: <U>(mapper: (value: T) => U) => U[];
    readonly size: number;
};

declare const useThrottle: <T extends (...args: any[]) => any>(fn: T) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};

type WindowEvent<T extends string> = T extends keyof WindowEventMap ? WindowEventMap[T] : Event;
declare function useWindowEvent<T extends string>(type: T, callback: (event: WindowEvent<T>) => void): void;

type EventName = string;
type CallbackConstraint = (...args: any[]) => any;
type EventCallback = {
    subscription: CallbackConstraint;
};
declare class EventBus {
    private callbacks;
    constructor();
    getEventCallbacks: (event: EventName) => EventCallback[];
    getEvents: () => string[];
    registerEvent<T extends CallbackConstraint>(event: EventName, callback: T): void;
    unregisterEventCallback<T extends CallbackConstraint>(event: EventName, callback: T): void;
    unregisterEvent(event: EventName): void;
    publish<T extends EventName, U extends Parameters<CallbackConstraint> | undefined = undefined>(...args: U extends undefined ? [T] : [T, U]): void;
}

declare const debounce: <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};

declare const throttle: <T extends (...args: any[]) => any>(fn: T) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};

type DefaultValue<T> = T | ((err: unknown) => T);
declare function tryExecute<T, K>(value: () => T, defaultValue: DefaultValue<K>): T | K;
declare function tryExecute<T>(value: () => T): T | undefined;
declare function tryExecute<T, K>(value: Promise<T> | (() => Promise<T>), defaultValue: DefaultValue<K>): Promise<T | K>;
declare function tryExecute<T>(value: Promise<T> | (() => Promise<T>)): Promise<T | undefined>;

export { EventBus, createOptimizedContext, debounce, throttle, tryExecute, useCustomCompare, useDebounce, useDebouncedEffect, useEvent, useIsMounted, useLatest, useLayerManager, useMap, useOutsideClick, usePrevious, useResizeObserver, useSet, useThrottle, useWindowEvent };
