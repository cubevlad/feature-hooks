export declare const useSet: <T>(initialData?: Iterable<T>) => {
    add: (value: T) => Set<T>;
    has: (value: T) => boolean;
    remove: (value: T) => boolean;
    clear: () => void;
    map: <U>(mapper: (value: T) => U) => U[];
    readonly size: number;
};
//# sourceMappingURL=index.d.ts.map