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
export class LayerManager {
  private children: LayerManager[] = [];
  private elementRef: React.RefObject<HTMLElement>;
  private triggerRef?: React.RefObject<HTMLElement>;

  constructor({ elementRef, triggerRef }: LayerManagerConstructorProps) {
    this.elementRef = elementRef;
    this.triggerRef = triggerRef;
  }

  registerChild = (child: LayerManager) => {
    this.children.push(child);

    return () => {
      const index = this.children.indexOf(child);

      if (index === -1) {
        return;
      }

      this.children.splice(index, 1);
    };
  };

  isOutsideClick = (target: EventTarget) => {
    if (!this.elementRef.current || !(target instanceof Node)) {
      return true;
    }

    const ignoreElements = [this.elementRef.current];

    if (this.triggerRef?.current) {
      ignoreElements.push(this.triggerRef.current);
    }

    const clickedInside = ignoreElements.some((element) => element.contains(target));

    if (clickedInside) {
      return false;
    }

    const clickOutsideOfChildLayers = this.children.every((child) => child.isOutsideClick(target));

    if (clickOutsideOfChildLayers) {
      return true;
    }

    return false;
  };
}
