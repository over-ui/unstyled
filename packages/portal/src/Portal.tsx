import * as React from 'react';
import ReactDOM from 'react-dom';

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/
const PORTAL_NAME = 'Portal';

type PortalElement = HTMLDivElement;
type PortalProps = {
  container?: HTMLElement | null;
  children?: React.ReactNode;
};

export const Portal = React.forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { container = globalThis?.document?.body, ...portalProps } = props;

  return container
    ? ReactDOM.createPortal(<div {...portalProps} ref={forwardedRef} />, container)
    : null;
});

Portal.displayName = PORTAL_NAME;
