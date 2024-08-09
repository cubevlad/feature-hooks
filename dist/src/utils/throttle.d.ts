export declare const throttle: <T extends (...args: any[]) => any>(fn: T) => {
    (...args: Parameters<T>): void;
    cancel(): void;
};
//# sourceMappingURL=throttle.d.ts.map