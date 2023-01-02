# `over-dismissableLayer`

`DismissableLayer`는 모달 컴포넌트의 닫히는 동작을 위해 만들어진 레이어 컴포넌트 입니다
모달을 만들 때 마다 처리에 대한 반복되는 부분이 발생하기때문에 관심사의 분리를 위해 구현하게 됐습니다
모달의 content가 되는 부분을 감싸서 `dismissableLayer가 아닌 부분을 클릭하거나, 포커스를 내보내거나, escape 키를 눌렀을 경우` onDismiss 함수를 실행시켜 모달을 닫는 방법으로 사용할 수 있습니다

## Usage

```tsx
import * as React from 'react';
import { Poly } from '@over-ui/core';
import { DismissableLayer } from '@over-ui/dismissableLayer';

//...DemoDialog
type DemoDialogContentImplElement = React.ElementRef<typeof DismissableLayer>;
type DemoDismissableLayerProps = {
  children?: React.ReactNode;
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;
  onDismiss?: () => void;
};
type DemoDialogContentImplProps = React.HTMLProps<HTMLDivElement> &
  Omit<DismissableLayerProps, 'onDismiss'>;

const DEMO_DIALOG_CONTENT_IMPL_TAG = 'div';

const DemoDialogContentImpl: Poly.Component<
  typeof DEMO_DIALOG_CONTENT_IMPL_TAG,
  DemoDialogContentImplProps
> = React.forwardRef(
  <T extends React.ElementType = typeof DEMO_DIALOG_CONTENT_IMPL_TAG>(
    props: Poly.Props<T, DemoDialogContentImplProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, ...contentProps } = props;
    const context = useDialogContext();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    return (
      <>
        <DismissableLayer
          role="dialog"
          id={context.contentId}
          aria-describedby={context.descriptionId}
          aria-labelledby={context.titleId}
          data-state={getState(context.open)}
          {...contentProps}
          ref={contentRef}
          onDismiss={() => {
            context?.onOpenChange?.(false);
          }}
        />
      </>
    );
  }
);

type DemoDialogContentModalElement = DemoDialogContentImplElement;
type DemoDialogContentModalProps = DemoDialogContentImplProps;

const DemoDialogContentModal = React.forwardRef<
  DemoDialogContentModalElement,
  DemoDialogContentModalProps
>((props, forwardedRef) => {
  const { as, ...dialogContentProps } = props;
  const context = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePointerDownOutside = (event: PointerEvent) => {
    const ctrlLeftClick = event.button === 0 && event.ctrlKey === true;
    const isRightClick = event.button === 2 || ctrlLeftClick;

    //우클릭 모달 닫기 방지
    if (isRightClick) event.preventDefault();
  };

  const handleFocusOutside = (event: FocusEvent) => {
    event.preventDefault();
  };

  return (
    <DialogContentImpl
      {...dialogContentProps}
      ref={contentRef}
      onPointerDownOutside={composeEvent(handlePointerDownOutside, props.onPointerDownOutside)}
      onFocusOutside={composeEvent(handleFocusOutside, props.onFocusOutside)}
    />
  );
});

//...
```
