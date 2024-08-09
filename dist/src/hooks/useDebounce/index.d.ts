export declare const useDebounce: <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};
//# sourceMappingURL=index.d.ts.map