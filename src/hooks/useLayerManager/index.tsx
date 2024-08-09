import { LayerManager } from './LayerManager';
import { useEvent } from '../useEvent';
import * as React from 'react';

type UseLayerManagerProps = {
  elementRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  outsideClickEnabled?: boolean;
  onOutsideClick: (event: MouseEvent | TouchEvent) => void;
};

const LayerContext = React.createContext<LayerManager | null>(null);

export const useLayerManager = ({
  elementRef,
  onOutsideClick,
  outsideClickEnabled,
  triggerRef,
}: UseLayerManagerProps) => {
  const parentLayer = React.useContext(LayerContext);
  const layer = React.useMemo(
    () =>
      new LayerManager({
        elementRef,
        triggerRef,
      }),
    [],
  );

  React.useEffect(() => {
    if (!parentLayer) {
      return;
    }

    return parentLayer.registerChild(layer);
  }, []);

  const handleOutsideClick = useEvent(onOutsideClick);

  React.useEffect(() => {
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

  const renderLayer = (children: React.ReactNode) => (
    <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
  );

  return { renderLayer };
};
