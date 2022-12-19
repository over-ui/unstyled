# `over-ui/core`

`core` 패키지는, `over-ui` 패키지 전체에서 사용하는 훅, 유틸, 타입을 모아둔 패키지입니다. 내부에서만 사용하는 패키지입니다.

## Usage

### core/poly

`poly`는, 컴포넌트를 다형적으로 이용할 수 있는 type 입니다.  
아래와 같이, 사용해 컴포넌트를 작성한다면 해당 `tag`에 맞는 `attribute`만을 받고  
존재하지 않는 `attribute`를 사용하게 된다면 `typescript`에서 오류가 발생합니다.

```tsx
import * as React from 'react';
import { Poly } from '@over-ui/core';

type DemoProps = {
  children?: React.ReactNode;
  // Props type
};

const DEFAULT_DEMO_TAG = 'li';

const Demo: Poly.Component<typeof DEFAULT_DEMO_TAG, DemoProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_DEMO_TAG>(
    props: Poly.Props<T, DemoProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, children, ...restProps } = props;

    const Component = as || DEFAULT_DEMO_TAG;

    return (
      <Component {...restProps} ref={forwardedRef}>
        {children}
      </Component>
    );
  }
);

const DemoPage = () => {
  const liRef = React.useRef<HTMLLIElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* 
      <Demo ref={videoRef}>poly component</Demo>
      // error
       */}
      <Demo as="video" ref={videoRef} />
      <Demo as="div" ref={divRef} />
      <Demo ref={liRef} />

      {/* span 태그의 경우 대부분의 ref 타입을 받을 수 있어 오류가 나지 않습니다. */}
      <span ref={videoRef}>some fancy text</span>
    </>
  );
  /* as prop을 이용해, 해당 컴포넌트의 태그를 바꿀 수 있습니다. */
  /* as prop으로 사용한 태그에 알맞는 ref 타입만을 받을 수 있습니다. */
};

export default DemoPage;
```

### core/composeEvent

외부에서 주입한 이벤트와 내부에 미리 선언되어있는 이벤트를 합성해주는 유틸 함수입니다.

```tsx
import * as React from 'react';
import { Poly, composeEvent } from '@over-ui/core';

type DemoProps = {
  children?: React.ReactNode;
};

const DEFAULT_DEMO_TAG = 'div';

const Demo: Poly.Component<typeof DEFAULT_DEMO_TAG, DemoProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_DEMO_TAG>(
    props: Poly.Props<T, DemoProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const { as, children, onClick, ...restProps } = props;
    /* onClick 이벤트를 새로운 props으로 받을 수 있습니다. */
    const Component = as || DEFAULT_DEMO_TAG;

    const handleClick = () => {
      console.log('clicked!');
    };
    /* 기존 이벤트와 새롭게 추가된 이벤트를 합성합니다 */
    return (
      <Component onClick={composeEvent(handleClick, onClick)} {...restProps}>
        {children}
      </Component>
    );
  }
);

Demo.displayName = 'Demo';

const DemoPage = () => {
  const handleClick = () => {
    console.log('in outside');
  };
  return <Demo onClick={handleClick}>poly component</Demo>;
};

export default DemoPage;
```

### core/useSafeContext

```tsx
const ToggleContext = React.createContext<any>(null);

const MultiItem = (props: singItemPRops) => {
  const { children, value, ...restProps } = props;
  const { pressedValue, setPressedValue } = useSafeContext(ToggleContext, 'Toggle.MultiItem');
  // useSafeContext를 사용해, 개별적은 useToggleContext 등의 훅을 작성하지 않아도 됩니다.
  const isPressed = pressedValue === value;
  const ariaProps = {
    role: 'radio',
    'aria-pressed': undefined,
    'aria-checked': isPressed,
  };
  return (
    <Toggle
      tabIndex={-1}
      pressed={isPressed}
      onPressedChange={(pressed) => (pressed ? setPressedValue(value) : setPressedValue(''))}
      {...ariaProps}
      {...restProps}
    >
      {children}
    </Toggle>
  );
};
```
