import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Poly } from '@over-ui/core';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/
type PortalProps = {
  container?: HTMLElement | null;
  children?: React.ReactNode;
};

const PORTAL_TAG = 'div';

const Portal: Poly.Component<typeof PORTAL_TAG, PortalProps> = React.forwardRef(
  <T extends React.ElementType = typeof PORTAL_TAG>(
    props: Poly.Props<T, PortalProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, container = globalThis?.document?.body, ...portalProps } = props;
    const Tag = as || PORTAL_TAG;

    return container
      ? ReactDOM.createPortal(<Tag {...portalProps} ref={forwardedRef} />, container)
      : null;
  }
);

Portal.displayName = 'PORTAL';

export { Portal };
