# `over-ui/portal`

`portal` 패키지는, 컴포넌트에서 모달 기능을 사용할 때 필요한 포탈을 생성하는 컴포넌트입니다.
임의로 `container`를 지정해서 그 곳에 포탈을 열 수 있고, 지정되지 않았다면 기본값으로 `body`에 포탈이 생성됩니다

## Usage

### portal

```tsx
import * as React from 'react';
import { Poly } from '@over-ui/core';
import { Portal as PortalPrimitive } from '@over-ui/portal';

type DemoPortalProps = {
  container?: HTMLElement | null;
  children?: React.ReactNode;
};

const DemoPortal = (props: DemoPortalProps) => {
  const { children, container } = props;

  /* context나 state가 있을 경우 모달이 열리는 조건으로 활용할 수 있습니다 */
  return <PortalPrimitive container={container}>{children}</PortalPrimitive>;
};

type DemoPortalContentProps = {
  children?: React.ReactNode;
};

const DEFAULT_DEMO_TAG = 'div';

const DemoPortalContent: Poly.Component<typeof DEFAULT_DEMO_TAG, DemoPortalContentProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DEFAULT_DEMO_TAG>(
      props: Poly.Props<T, DemoPortalContentProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, children, ...restProps } = props;

      const Tag = as || DEFAULT_DEMO_TAG;

      return (
        /* container props를 활용하여 container를 직접 지정해 줄 수 있습니다 */
        <DemoPortal>
          <Tag {...restProps} ref={forwardedRef}>
            {children}
          </Tag>
        </DemoPortal>
      );
    }
  );
```
