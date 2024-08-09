export declare const debounce: <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};
//# sourceMappingURL=debounce.d.ts.map