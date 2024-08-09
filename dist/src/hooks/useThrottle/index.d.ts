export declare const useThrottle: <T extends (...args: any[]) => any>(fn: T) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};
//# sourceMappingURL=index.d.ts.map