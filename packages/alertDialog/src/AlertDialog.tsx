/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import { Poly, useSafeContext } from '@over-ui/core';
import * as DialogPrimitive from '@over-ui/dialog';
import { mergeRefs } from '@over-ui/merge-refs';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/
type DialogProps = Poly.Props<typeof DialogPrimitive.Root>;
type AlertDialogProps = DialogProps & {};

const ALERT_DIALOG_DISPLAY_NAME = 'ALERT_DIALOG_ROOT';

const AlertDialog: React.FC<AlertDialogProps> = (props: AlertDialogProps) => {
  const { ...alertDialogProps } = props;

  return <DialogPrimitive.Root {...alertDialogProps} modal={true} />;
};

AlertDialog.displayName = ALERT_DIALOG_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/
type DialogTriggerProps = Poly.Props<typeof DialogPrimitive.Trigger>;
type AlertDialogTriggerProps = DialogTriggerProps & {};

const ALERT_DIALOG_TRIGGER_TAG = 'button';
const ALERT_DIALOG_TRIGGER_DISPLAY_NAME = 'ALERT_DIALOG_TRIGGER';

const AlertDialogTrigger: Poly.Component<typeof ALERT_DIALOG_TRIGGER_TAG, AlertDialogTriggerProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_TRIGGER_TAG>(
      props: Poly.Props<T, AlertDialogTriggerProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...triggerProps } = props;

      return <DialogPrimitive.Trigger {...triggerProps} ref={forwardedRef} />;
    }
  );

AlertDialogTrigger.displayName = ALERT_DIALOG_TRIGGER_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogPortal
 * -----------------------------------------------------------------------------------------------*/
type DialogPortalProps = Poly.Props<typeof DialogPrimitive.Portal>;
type AlertDialogPortalProps = DialogPortalProps & {};

const ALERT_DIALOG_PORTAL_DISPLAY_NAME = 'ALERT_DIALOG_PORTAL';

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (props: AlertDialogPortalProps) => {
  const { as, ...portalProps } = props;

  return <DialogPrimitive.Portal {...portalProps} />;
};

AlertDialogPortal.displayName = ALERT_DIALOG_PORTAL_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/
type DialogOverlayProps = Poly.Props<typeof DialogPrimitive.Overlay>;
type AlertDialogOverlayProps = DialogOverlayProps & {};

const ALERT_DIALOG_OVERLAY_TAG = 'div';
const ALERT_DIALOG_OVERLAY_DISPLAY_NAME = 'ALERT_DIALOG_OVERLAY';

const AlertDialogOverlay: Poly.Component<typeof ALERT_DIALOG_OVERLAY_TAG, AlertDialogOverlayProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_OVERLAY_TAG>(
      props: Poly.Props<T, AlertDialogOverlayProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...overlayProps } = props;

      return <DialogPrimitive.Overlay {...overlayProps} ref={forwardedRef} />;
    }
  );

AlertDialogOverlay.displayName = ALERT_DIALOG_OVERLAY_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/
type AlertDialogContentContextValue = {
  cancelRef?: React.RefObject<HTMLButtonElement>;
};

const AlertDialogContext = React.createContext<AlertDialogContentContextValue>({});

const AlertDialogContentProvider = (
  props: AlertDialogContentContextValue & { children: React.ReactNode }
) => {
  const { children, ...context } = props;
  const value = context;

  return <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>;
};

/* -----------------------------------------------------------------------------------------------*/
type DialogContentProps = Poly.Props<typeof DialogPrimitive.Content>;
type AlertDialogContentProps = Omit<
  DialogContentProps,
  'onPointerDownOutside' | 'onInteractOutside'
> & {};

const ALERT_DIALOG_CONTENT_TAG = 'div';
const ALERT_DIALOG_CONTENT_DISPLAY_NAME = 'ALERT_DIALOG_CONTENT';

const AlertDialogContent: Poly.Component<typeof ALERT_DIALOG_CONTENT_TAG, AlertDialogContentProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_CONTENT_TAG>(
      props: Poly.Props<T, AlertDialogContentProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...contentProps } = props;
      const cancelRef = React.useRef<HTMLButtonElement>(null);

      return (
        <AlertDialogContentProvider cancelRef={cancelRef}>
          <DialogPrimitive.Content
            role="alertdialog"
            {...contentProps}
            ref={forwardedRef}
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
          />
        </AlertDialogContentProvider>
      );
    }
  );

AlertDialogContent.displayName = ALERT_DIALOG_CONTENT_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/
type DialogTitleProps = Poly.Props<typeof DialogPrimitive.Title>;
type AlertDialogTitleProps = DialogTitleProps & {};

const ALERT_DIALOG_TITLE_TAG = 'h2';
const ALERT_DIALOG_TITLE_DISPLAY_NAME = 'ALERT_DIALOG_TITLE';

const AlertDialogTitle: Poly.Component<typeof ALERT_DIALOG_TITLE_TAG, AlertDialogTitleProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_TITLE_TAG>(
      props: Poly.Props<T, AlertDialogTitleProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...titleProps } = props;

      return <DialogPrimitive.Title {...titleProps} ref={forwardedRef} />;
    }
  );

AlertDialogTitle.displayName = ALERT_DIALOG_TITLE_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/
type DialogDescriptionProps = Poly.Props<typeof DialogPrimitive.Description>;
type AlertDialogDescriptionProps = DialogDescriptionProps & {};

const ALERT_DIALOG_DESCRIPTION_TAG = 'p';
const ALERT_DIALOG_DESCRIPTION_DISPLAY_NAME = 'ALERT_DIALOG_DESCRIPTION';

const AlertDialogDescription: Poly.Component<
  typeof ALERT_DIALOG_DESCRIPTION_TAG,
  AlertDialogDescriptionProps
> = React.forwardRef(
  <T extends React.ElementType = typeof ALERT_DIALOG_DESCRIPTION_TAG>(
    props: Poly.Props<T, AlertDialogDescriptionProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, ...descriptionProps } = props;

    return <DialogPrimitive.Description {...descriptionProps} ref={forwardedRef} />;
  }
);

AlertDialogDescription.displayName = ALERT_DIALOG_DESCRIPTION_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/
type DialogCloseProps = Poly.Props<typeof DialogPrimitive.Close>;
type AlertDialogActionProps = DialogCloseProps & {};

const ALERT_DIALOG_ACTION_TAG = 'button';
const ALERT_DIALOG_ACTION_DISPLAY_NAME = 'ALERT_DIALOG_ACTION';

const AlertDialogAction: Poly.Component<typeof ALERT_DIALOG_ACTION_TAG, AlertDialogActionProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_ACTION_TAG>(
      props: Poly.Props<T, AlertDialogActionProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...actionProps } = props;

      return <DialogPrimitive.Close {...actionProps} ref={forwardedRef} />;
    }
  );

AlertDialogAction.displayName = ALERT_DIALOG_ACTION_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/
type AlertDialogCancelProps = DialogCloseProps & {};

const ALERT_DIALOG_CANCEL_TAG = 'button';
const ALERT_DIALOG_CANCEL_DISPLAY_NAME = 'ALERT_DIALOG_CANCEL';

const AlertDialogCancel: Poly.Component<typeof ALERT_DIALOG_CANCEL_TAG, AlertDialogCancelProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof ALERT_DIALOG_CANCEL_TAG>(
      props: Poly.Props<T, AlertDialogCancelProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...cancelProps } = props;
      const context = useSafeContext(AlertDialogContext, 'AlertDialog.Cancl');
      const mergedRef = mergeRefs([
        forwardedRef,
        context.cancelRef as React.MutableRefObject<HTMLButtonElement>,
      ]);

      return <DialogPrimitive.Close {...cancelProps} ref={mergedRef} />;
    }
  );

AlertDialogCancel.displayName = ALERT_DIALOG_CANCEL_DISPLAY_NAME;

const Root = AlertDialog;
const Trigger = AlertDialogTrigger;
const Portal = AlertDialogPortal;
const Overlay = AlertDialogOverlay;
const Content = AlertDialogContent;
const Action = AlertDialogAction;
const Cancel = AlertDialogCancel;
const Title = AlertDialogTitle;
const Description = AlertDialogDescription;

export {
  //
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Action,
  Cancel,
  Title,
  Description,
};
