type DefaultValue<T> = T | ((err: unknown) => T);
export declare function tryExecute<T, K>(value: () => T, defaultValue: DefaultValue<K>): T | K;
export declare function tryExecute<T>(value: () => T): T | undefined;
export declare function tryExecute<T, K>(value: Promise<T> | (() => Promise<T>), defaultValue: DefaultValue<K>): Promise<T | K>;
export declare function tryExecute<T>(value: Promise<T> | (() => Promise<T>)): Promise<T | undefined>;
export {};
//# sourceMappingURL=tryExecute.d.ts.map