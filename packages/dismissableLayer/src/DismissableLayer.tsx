import * as React from 'react';
import { Poly, useSafeContext } from '@over-ui/core';
import { mergeRefs } from '@over-ui/merge-refs';

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
  //DismissableLayer가 생성되면 layers에 add
  //layer가 여러겹일 경우, 해당 layer가 최상위에 위치한 layer인지 판단하고, 최상위 layer가 아닐 경우 return
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
      const context = useSafeContext(DismissableLayerContext, 'DismissableLayer');
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

      /* keyDown handler */
      const handleEscapeKeyDown = (event: KeyboardEvent) => {
        if (!node) return;
        if (event.key !== 'Escape') return;

        const layers = Array.from(context.layers);
        const curIndex = node ? layers.indexOf(node) : -1;
        const isHighestLayer = curIndex === context.layers.size - 1;

        if (!isHighestLayer) return;

        onEscapeKeyDown?.(event);

        if (!event.defaultPrevented) {
          event.preventDefault();
          onDismiss?.();
        }
      };

      React.useEffect(() => {
        document.addEventListener('keydown', handleEscapeKeyDown);
        return () => {
          document.removeEventListener('keydown', handleEscapeKeyDown);
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
        <Tag ref={mergeRefs([dismissableLayerRef, forwardedRef])} {...layerProps}>
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
