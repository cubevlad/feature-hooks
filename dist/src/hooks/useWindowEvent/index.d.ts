type WindowEvent<T extends string> = T extends keyof WindowEventMap ? WindowEventMap[T] : Event;
export declare function useWindowEvent<T extends string>(type: T, callback: (event: WindowEvent<T>) => void): void;
export {};
//# sourceMappingURL=index.d.ts.map