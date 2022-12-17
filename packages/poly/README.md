# `over-ui/poly`

`as` prop을 사용해, 컴포넌트의 태그를 다형적으로 이용할 수 있도록 하는 `type` 입니다.  
이 `type`을 사용함으로써, 해당 태그에 맞는 `attribute`만을 받을 수 있으며 해당태그에 맞지 않는다면 타입스크립트에서 오류가 발생합니다.

## Usage

```tsx
import * as React from "react";
import * as Poly from "@over-ui/poly";

const DEFAULT_DEMO_TAG = "div";

export type DemoProps = {
 */ write DemoComponent Props */
  children?: React.ReactNode;
  */ render Props가 사용되는 컴포넌트가 존재해, children을 기본 type지정에서 제거했습니다. */
};

export const Demo: Poly.Component<typeof DEFAULT_DEMO_TAG, DemoProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DEFAULT_DEMO_TAG>(
      props: Poly.Props<T, DemoProps>,
      forwardedRef: Poly.Ref<T>,
    ) => {
      const {
        as,
        ...restProps
      } = props;

      const Component = as || DEFAULT_TOGGLE;

      return (
        <Component
          {...restProps}
        >
          {children}
        </Component>
      );
    },
  );

Demo.displayName = "Demo";

```
