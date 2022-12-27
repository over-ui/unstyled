import * as React from 'react';
import { Poly } from '@over-ui/core';

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 * -----------------------------------------------------------------------------------------------*/

type DismissableLayerProps = {
  children?: React.ReactNode;
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;
  onDismiss?: () => void;
};

const DISMISSABLE_LAYER_TAG = 'div';

const DismissableLayerContext = React.createContext({
  //DismissableLayer가 생성되면 layers에 넣고
  //해당 layer가 최상위에 위치한 layer인지 판단하고, 최상위 layer가 아닐 경우 return
  layers: new Set<HTMLDivElement>(),
});

const DismissableLayer: Poly.Component<typeof DISMISSABLE_LAYER_TAG, DismissableLayerProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DISMISSABLE_LAYER_TAG>(
      props: Poly.Props<T, DismissableLayerProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const {
        as,
        children,
        disableOutsidePointerEvents = true,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const Tag = as || DISMISSABLE_LAYER_TAG;
      const context = React.useContext(DismissableLayerContext);
      const dismissableLayerRef = React.useRef<HTMLDivElement | null>(null);
      const [node, setNode] = React.useState<HTMLDivElement | null>(null);
      const document = globalThis?.document;

      React.useEffect(() => {
        setNode(dismissableLayerRef.current);
      }, []);

      React.useEffect(() => {
        if (!node) return;
        context.layers.add(node);

        return () => {
          if (!node) return;
          context.layers.delete(node);
        };
      }, [node, document, context]);

      return (
        <Tag ref={dismissableLayerRef} {...layerProps}>
          {children}
        </Tag>
      );
    }
  );

DismissableLayer.displayName = 'DISMISSABLE_LAYER';

const Root = DismissableLayer;

export {
  DismissableLayer,
  //
  Root,
};

export type { DismissableLayerProps };
