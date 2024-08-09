type InitialDataType<T, U> = ReadonlyArray<readonly [T, U]>;
export declare const useMap: <T, U>(initialData?: InitialDataType<T, U>) => {
    set: (key: T, value: U) => Map<T, U>;
    has: (key: T) => boolean;
    remove: (key: T) => boolean;
    clear: () => void;
    map: <V>(mapper: (value: U, key: T) => V) => V[];
    readonly size: number;
};
export {};
//# sourceMappingURL=index.d.ts.map