import * as React from "react";
export declare function createOptimizedContext<T>(): {
    Provider: ({ children, initialState, }: {
        children: React.ReactNode;
        initialState: T;
    }) => React.JSX.Element;
    useStoreUpdate: () => (state: Partial<T>) => void;
    useStoreSelector: <U>(selector: (state: T) => U) => U;
};
//# sourceMappingURL=index.d.ts.map