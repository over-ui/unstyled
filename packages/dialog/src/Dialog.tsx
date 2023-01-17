/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import { Poly, composeEvent, useSafeContext } from '@over-ui/core';
import { Portal as PortalPrimitive } from '@over-ui/portal';
import { DismissableLayer, DismissableLayerProps } from '@over-ui/dismissable-layer';
import { FocusTrapLayer, FocusTrapLayerProps } from '@over-ui/focus-trap-layer';
import { useControlled } from '@over-ui/use-controlled';
import { mergeRefs } from '@over-ui/merge-refs';
import { hideOthers } from 'aria-hidden';
import { RemoveScroll } from 'react-remove-scroll';
/* -------------------------------------------------------------------------------------------------
 * DialogContext
 * -----------------------------------------------------------------------------------------------*/
type DialogContextValue = {
  triggerRef?: React.RefObject<HTMLButtonElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  contentId?: string;
  titleId?: string;
  descriptionId?: string;
  modal?: boolean;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onOpenToggle?(): void;
};

const DialogContext = React.createContext<DialogContextValue>({});

const DialogProvider = (props: DialogContextValue & { children: React.ReactNode }) => {
  const { children, ...context } = props;
  const value = context;

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/
type DialogProps = {
  children?: React.ReactNode;
  modal?: boolean;
  open?: boolean;
  defalutOpen?: boolean;
  onOpenChange?(open: boolean): void;
};

const DIALOG_DISPLAY_NAME = 'DIALOG_ROOT';

const Dialog: React.FC<DialogProps> = (props) => {
  const { children, modal = true, open: openProp, defalutOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [open = false, setOpen] = useControlled({
    value: openProp,
    defaultValue: defalutOpen,
    valueOnChange: onOpenChange,
  });

  return (
    <DialogProvider
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={React.useId()}
      titleId={React.useId()}
      descriptionId={React.useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={() => setOpen((prev) => !prev)}
      modal={modal}
    >
      {children}
    </DialogProvider>
  );
};

Dialog.displayName = DIALOG_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/
type DialogTriggerProps = {
  children?: React.ReactNode;
};

const DIALOG_TRIGGER_TAG = 'button';
const DIALOG_TRIGGER_DISPLAY_NAME = 'DIALOG_TRIGGER';

const DialogTrigger: Poly.Component<typeof DIALOG_TRIGGER_TAG, DialogTriggerProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_TRIGGER_TAG>(
      props: Poly.Props<T, DialogTriggerProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...triggerProps } = props;
      const Tag = as || DIALOG_TRIGGER_TAG;
      const context = useSafeContext(DialogContext, 'Dialog.Trigger');
      const mergedTriggerRef = mergeRefs([
        forwardedRef,
        context.triggerRef as React.MutableRefObject<HTMLButtonElement>,
      ]);

      return (
        <Tag
          type="button"
          aria-haspopup="dialog"
          aria-expanded={context.open}
          aria-controls={context.contentId}
          data-state={getState(context.open)}
          {...triggerProps}
          ref={mergedTriggerRef}
          onClick={context.onOpenToggle}
        />
      );
    }
  );

DialogTrigger.displayName = DIALOG_TRIGGER_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/
type DailogPortalContextValue = {};
const DialogPortalContext = React.createContext<DailogPortalContextValue>({});

const DialogPortalProvider = (props: DailogPortalContextValue & { children: React.ReactNode }) => {
  const { children, ...context } = props;
  const value = context;

  return <DialogPortalContext.Provider value={value}>{children}</DialogPortalContext.Provider>;
};

type PortalProps = Poly.Props<typeof PortalPrimitive>;
type DialogPortalProps = {
  container?: HTMLElement | null;
  children?: React.ReactNode;
} & PortalProps;

const DIALOG_PORTAL_DISPLAY_NAME = 'DIALOG_PORTAL';

const DialogPortal: React.FC<DialogPortalProps> = (props) => {
  const { children, container } = props;
  const context = useSafeContext(DialogContext, 'Dialog.Portal');

  return (
    <DialogPortalProvider>
      <>{context.open && <PortalPrimitive container={container}>{children}</PortalPrimitive>}</>
    </DialogPortalProvider>
  );
};

DialogPortalContext.displayName = DIALOG_PORTAL_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/
type DialogOverlayProps = DialogOverlayImplProps & {};

const DIALOG_OVERLAY_TAG = 'div';
const DIALOG_OVERLAY_DISPLAY_NAME = 'DIALOG_OVERLAY';

const DialogOverlay: Poly.Component<typeof DIALOG_OVERLAY_TAG, DialogOverlayProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_OVERLAY_TAG>(
      props: Poly.Props<T, DialogOverlayProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...dialogOverlayProps } = props;
      const context = useSafeContext(DialogContext, 'Dialog.Overlay');

      return context.modal ? (
        <>{context.open && <DialogOverlayImpl {...dialogOverlayProps} ref={forwardedRef} />}</>
      ) : null;
    }
  );

DialogOverlay.displayName = DIALOG_OVERLAY_DISPLAY_NAME;

/* -----------------------------------------------------------------------------------------------*/
type DialogOverlayImplProps = {
  children?: React.ReactNode;
};

const DIALOG_OVERLAY_IMPL_TAG = 'div';

const DialogOverlayImpl: Poly.Component<typeof DIALOG_OVERLAY_IMPL_TAG, DialogOverlayImplProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_OVERLAY_IMPL_TAG>(
      props: Poly.Props<T, DialogOverlayImplProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...dialogOverlayImplProps } = props;
      const Tag = as || DIALOG_OVERLAY_IMPL_TAG;
      const context = useSafeContext(DialogContext, 'Dialog.OverlayImpl');
      return (
        <>
          <RemoveScroll>
            <Tag
              data-state={getState(context.open)}
              {...dialogOverlayImplProps}
              ref={forwardedRef}
              style={{ ...props.style }}
            />
          </RemoveScroll>
        </>
      );
    }
  );

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/
type DialogContentProps = DialogContentModalProps & {};

const DIALOG_CONTENT_TAG = 'div';
const DIALOG_CONTENT_DISPLAY_NAME = 'DIALOG_CONTENT';

const DialogContent: Poly.Component<typeof DIALOG_CONTENT_TAG, DialogContentProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_CONTENT_TAG>(
      props: Poly.Props<T, DialogContentProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...contentProps } = props;
      const context = useSafeContext(DialogContext, 'Dialog.Content');

      return (
        <>
          {context.open && context.modal ? (
            <DialogContentModal
              aria-modal="true"
              {...contentProps}
              ref={forwardedRef}
              style={{ overflow: 'hidden' }}
            />
          ) : (
            <DialogContentNonModal
              {...contentProps}
              ref={forwardedRef}
              style={{ overflow: 'hidden' }}
            />
          )}
        </>
      );
    }
  );

DialogContent.displayName = DIALOG_CONTENT_DISPLAY_NAME;

/* -----------------------------------------------------------------------------------------------*/
type DialogContentModalProps = Omit<
  DialogContentImplProps,
  'trapFocus' | 'disableOutsidePointerEvents'
>;

const DialogContentModal: Poly.Component<typeof DIALOG_CONTENT_TAG, DialogContentModalProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_CONTENT_TAG>(
      props: Poly.Props<T, DialogContentModalProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...dialogContentModalProps } = props;
      const context = useSafeContext(DialogContext, 'Dialog.ContentModal');
      const contentRef = React.useRef<HTMLDivElement>(null);
      const mergedRef = mergeRefs([
        contentRef,
        forwardedRef,
        context.contentRef as React.MutableRefObject<HTMLDivElement>,
      ]);

      const handlePointerDownOutside = (event: PointerEvent) => {
        const ctrlLeftClick = event.button === 0 && event.ctrlKey === true;
        const isRightClick = event.button === 2 || ctrlLeftClick;

        //우클릭 모달 닫기 방지
        if (isRightClick) event.preventDefault();
      };

      const handleFocusOutside = (event: FocusEvent) => {
        event.preventDefault();
      };

      React.useEffect(() => {
        const content = contentRef.current;
        //hideOthers는 파라미터로 들어간 엘리먼트를 제외한 다른 DOM 요소들의
        //aria - hidden을 true로 설정해주어 더 나은 접근성을 제공해줍니다.
        if (content) return hideOthers(content);
      }, []);

      return (
        <DialogContentImpl
          {...dialogContentModalProps}
          ref={mergedRef}
          trapFocus={context.open}
          disableOutsidePointerEvents
          onPointerDownOutside={composeEvent(handlePointerDownOutside, props.onPointerDownOutside)}
          onFocusOutside={composeEvent(handleFocusOutside, props.onFocusOutside)}
        />
      );
    }
  );

/* -----------------------------------------------------------------------------------------------*/
const DialogContentNonModal: Poly.Component<typeof DIALOG_CONTENT_TAG, DialogContentModalProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_CONTENT_TAG>(
      props: Poly.Props<T, DialogContentModalProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...dialogContentNonModalProps } = props;
      const context = useSafeContext(DialogContext, 'Dialog.ContentNonModal');

      const handleInteractOutside = (event: FocusEvent | PointerEvent) => {
        props.onInteractOutside?.(event);

        const target = event.target as HTMLElement;
        const targetIsTrigger = context.triggerRef?.current?.contains(target);
        if (targetIsTrigger) event.preventDefault();
      };

      return (
        <DialogContentImpl
          {...dialogContentNonModalProps}
          ref={forwardedRef}
          trapFocus={false}
          disableOutsidePointerEvents={false}
          onInteractOutside={handleInteractOutside}
        />
      );
    }
  );

/* -----------------------------------------------------------------------------------------------*/
type DialogContentImplProps = Omit<DismissableLayerProps, 'onDismiss'> & {
  trapFocus?: FocusTrapLayerProps['trapped'];
};

const DIALOG_CONTENT_IMPL_TAG = 'div';

const DialogContentImpl: Poly.Component<typeof DIALOG_CONTENT_IMPL_TAG, DialogContentImplProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_CONTENT_IMPL_TAG>(
      props: Poly.Props<T, DialogContentImplProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, trapFocus, ...contentProps } = props;
      const context = useSafeContext(DialogContext, 'Dialog.ContentImpl');

      return (
        <>
          <FocusTrapLayer loop trapped={trapFocus}>
            <DismissableLayer
              role="dialog"
              id={context.contentId}
              aria-describedby={context.descriptionId}
              aria-labelledby={context.titleId}
              data-state={getState(context.open)}
              {...contentProps}
              ref={forwardedRef}
              onDismiss={() => {
                context?.onOpenChange?.(false);
              }}
            />
          </FocusTrapLayer>
        </>
      );
    }
  );

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/
type DialogTitleProps = {};

const DIALOG_TITLE_TAG = 'h2';
const DIALOG_TITLE_DISPLAY_NAME = 'DIALOG_TITLE';

const DialogTitle: Poly.Component<typeof DIALOG_TITLE_TAG, DialogTitleProps> = React.forwardRef(
  <T extends React.ElementType = typeof DIALOG_TITLE_TAG>(
    props: Poly.Props<T, DialogTitleProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, ...titleProps } = props;
    const Tag = as || DIALOG_TITLE_TAG;
    const context = useSafeContext(DialogContext, 'Dialog.Title');

    return <Tag id={context.titleId} {...titleProps} ref={forwardedRef} />;
  }
);

DialogTitle.displayName = DIALOG_TITLE_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/
type DialogDescriptionProps = {};

const DIALOG_DESCRIPTION_TAG = 'p';
const DIALOG_DESCRIPTION_DISPLAY_NAME = 'DIALOG_DESCRIPTION';

const DialogDescription: Poly.Component<typeof DIALOG_DESCRIPTION_TAG, DialogDescriptionProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DIALOG_DESCRIPTION_TAG>(
      props: Poly.Props<T, DialogDescriptionProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...descriptionProps } = props;
      const Tag = as || DIALOG_DESCRIPTION_TAG;
      const context = useSafeContext(DialogContext, 'Dialog.Description');

      return <Tag id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />;
    }
  );

DialogDescription.displayName = DIALOG_DESCRIPTION_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/
type DialogCloseProps = {};

const DIALOG_CLOSE_TAG = 'button';
const DIALOG_CLOSE_DISPLAY_NAME = 'DIALOG_CLOSE';

const DialogClose: Poly.Component<typeof DIALOG_CLOSE_TAG, DialogCloseProps> = React.forwardRef(
  <T extends React.ElementType = typeof DIALOG_CLOSE_TAG>(
    props: Poly.Props<T, DialogCloseProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, ...closeProps } = props;
    const Tag = as || DIALOG_CLOSE_TAG;
    const context = useSafeContext(DialogContext, 'Dialog.Close');

    return (
      <Tag
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEvent(() => context.onOpenChange?.(false), props.onClick)}
      />
    );
  }
);

DialogClose.displayName = DIALOG_CLOSE_DISPLAY_NAME;

/* -----------------------------------------------------------------------------------------------*/
function getState(open: boolean | undefined) {
  return open ? 'open' : 'closed';
}

const Root = Dialog;
const Trigger = DialogTrigger;
const Portal = DialogPortal;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Title = DialogTitle;
const Description = DialogDescription;
const Close = DialogClose;

export {
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
  //
};
