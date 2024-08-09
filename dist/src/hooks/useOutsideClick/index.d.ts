import * as React from 'react';
type UseOutsideClickOptions = {
    elementRef: React.RefObject<HTMLElement>;
    triggerRef?: React.RefObject<HTMLElement>;
    onOutsideClick: (e: MouseEvent | TouchEvent) => void;
    enabled?: boolean;
};
export declare const useOutsideClick: ({ elementRef, onOutsideClick, triggerRef, enabled, }: UseOutsideClickOptions) => void;
export {};
//# sourceMappingURL=index.d.ts.map