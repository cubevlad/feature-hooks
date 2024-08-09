import * as React from "react";
type LayerManagerConstructorProps = {
    elementRef: React.RefObject<HTMLElement>;
    triggerRef?: React.RefObject<HTMLElement>;
};
/**
 * for manage simple outside click just use hook useOutSideClick.
 * This manager manage deep nested popups/portals event triggers
 * and save events bubbling hierarchy
 */
export declare class LayerManager {
    private children;
    private elementRef;
    private triggerRef?;
    constructor({ elementRef, triggerRef }: LayerManagerConstructorProps);
    registerChild: (child: LayerManager) => () => void;
    isOutsideClick: (target: EventTarget) => boolean;
}
export {};
//# sourceMappingURL=LayerManager.d.ts.map