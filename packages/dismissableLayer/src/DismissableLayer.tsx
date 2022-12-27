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

      /* pointerdown handler */
      const handlePointerDownOutside = (event: PointerEvent) => {
        if (!node) return;

        const target = event.target as HTMLElement;

        const layers = Array.from(context.layers);
        const curIndex = node ? layers.indexOf(node) : -1;
        const isHighestLayer = curIndex === context.layers.size - 1;

        //클릭한 target이 node 안의 엘리먼트인지 판단
        const isPointerDownOnBranch = dismissableLayerRef.current?.contains(target);
        if (!isHighestLayer || isPointerDownOnBranch || !disableOutsidePointerEvents) return;

        onPointerDownOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      };

      React.useEffect(() => {
        document.addEventListener('pointerdown', handlePointerDownOutside);
        return () => {
          document.removeEventListener('pointerdown', handlePointerDownOutside);
        };
      }, [document, node]);

      /* focusin handler */
      const handleFocusOutside = (event: FocusEvent) => {
        if (!node) return;

        const target = event.target as HTMLElement;

        const layers = Array.from(context.layers);
        const curIndex = node ? layers.indexOf(node) : -1;
        const isHighestLayer = curIndex === context.layers.size - 1;

        //포커스가 이동 된 target이 node 안의 엘리먼트인지 판단
        const isFocusedOnBranch =
          dismissableLayerRef.current?.contains(target) ||
          dismissableLayerRef.current?.parentElement?.contains(target);

        if (!isHighestLayer || isFocusedOnBranch) return;
        onFocusOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      };

      React.useEffect(() => {
        document.addEventListener('focusin', handleFocusOutside);
        return () => {
          document.removeEventListener('focusin', handleFocusOutside);
        };
      }, [document, node]);

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
