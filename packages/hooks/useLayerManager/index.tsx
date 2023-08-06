import { ReactNode, RefObject, createContext, useContext, useEffect, useMemo } from 'react';
import { LayerManager } from './LayerManager';
import { useEvent } from '../useEvent';

type UseLayerManagerProps = {
  elementRef: RefObject<HTMLElement>;
  triggerRef?: RefObject<HTMLElement>;
  outsideClickEnabled?: boolean;
  onOutsideClick: (event: MouseEvent | TouchEvent) => void;
};

const LayerContext = createContext<LayerManager | null>(null);

export const useLayerManager = ({
  elementRef,
  onOutsideClick,
  outsideClickEnabled,
  triggerRef,
}: UseLayerManagerProps) => {
  const parentLayer = useContext(LayerContext);
  const layer = useMemo(
    () =>
      new LayerManager({
        elementRef,
        triggerRef,
      }),
    [],
  );

  useEffect(() => {
    if (!parentLayer) {
      return;
    }

    return parentLayer.registerChild(layer);
  }, []);

  const handleOutsideClick = useEvent(onOutsideClick);

  useEffect(() => {
    if (!outsideClickEnabled) {
      return;
    }

    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (!e.target) {
        return;
      }

      if (layer.isOutsideClick(e.target)) {
        handleOutsideClick(e);
      }

      document.addEventListener('mousedown', handleClick);
      document.addEventListener('touchstart', handleClick);

      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('touchstart', handleClick);
      };
    };
  }, [layer, outsideClickEnabled]);

  const renderLayer = (children: ReactNode) => (
    <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
  );

  return { renderLayer };
};
