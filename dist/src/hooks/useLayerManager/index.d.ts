import * as React from 'react';
type UseLayerManagerProps = {
    elementRef: React.RefObject<HTMLElement>;
    triggerRef?: React.RefObject<HTMLElement>;
    outsideClickEnabled?: boolean;
    onOutsideClick: (event: MouseEvent | TouchEvent) => void;
};
export declare const useLayerManager: ({ elementRef, onOutsideClick, outsideClickEnabled, triggerRef, }: UseLayerManagerProps) => {
    renderLayer: (children: React.ReactNode) => React.JSX.Element;
};
export {};
//# sourceMappingURL=index.d.ts.map