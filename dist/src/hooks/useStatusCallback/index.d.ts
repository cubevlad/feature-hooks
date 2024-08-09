export declare const useStatusCallback: <T extends (...args: any[]) => any>(callback: T) => {
    isPending: boolean;
    wrappedCallback: (...args: Parameters<T>) => Promise<void>;
};
//# sourceMappingURL=index.d.ts.map