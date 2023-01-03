# `over-ui/useControlled`

`useControlled` 패키지는, `over-ui` 에서 상태를 관리하는 훅입니다.
내부에서만 사용하는 패키지입니다.

## Usage

```
const Toggle: Poly.Component<typeof DEFAULT_TOGGLE, ToggleProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DEFAULT_TOGGLE>(
      props: Poly.Props<T, ToggleProps>,
      ref: Poly.Ref<T>,
    ) => {
      const {
        onClick,
        onKeyDown,
        onPressedChange,
        disabled = false,
        children,
        defaultPressed = false,
        pressed: pressedProp,
        as,
        ...restProps
      } = props;

      const [pressed, setPressed] = useControlled({
        value: pressedProp,
        defaultValue: defaultPressed,
        onChange: onPressedChange,
      });

      ...
      );
    },
  );

```

이를 통해, 다음과 같이 이용할 수 있습니다.

```
function Home() {
  const [state, setState] = useState(false);
  return (
    <>
      <Toggle
        pressed={state}
        onPressedChange={(pressed) => setState(pressed)}
      />
    </>
  );
}

```

- useControlled의 value, onValueChange를 이용할 경우 외부의 상태를 이용할 수 있습니다.

```
function Home() {
  return (
    <>
      <Toggle
        defaultPressed={false}
        onPressedChange={(pressed) => console.log(pressed)}
        // false
      />
    </>
  );
}
```

- 외부의 상태를 정의하지 않고, 내부의 상태만을 활용할 수 있습니다.
