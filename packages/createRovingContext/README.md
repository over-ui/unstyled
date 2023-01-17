# `over-ui/createRovingContext`

`createRovingContext` 패키지는, `over-ui` 패키기 내부에서 사용하는 훅입니다.
`radio, toggle` 컴포넌트를 작성할 때의 접근성 규칙을 준수하기 위해 `roving TabIndex`를 구현합니다.

## Usage

```
// 사용 전에, rovingProvider로 사용해야 하는 컴포넌트를 묶어주세요.
const {rovingProvider, useRoving} = createRovingContext();
// group 요소
const Container: Poly.Component<typeof DEFAULT_ROOT, ContainerProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DEFAULT_ROOT>(
      props: Poly.Props<T, ContainerProps>,
      ref: Poly.Ref<T>,
    ) => {
      const {
        children,
        pressed,
        as,
        onFocus: theirOnFocus,
        onKeyDown: theirOnKeyDown,
        ...restProps
      } = props;
      const containerRef = React.useRef<HTMLDivElement>(null);
      const { handleRovingKeyDown, handleRovingFocus } = useRoving();

      // 그룹 요소에, rovingKeyDown, RovingFocus를 등록합니다.
      return (
        <Tag
          role='group'
          onFocus={composeEvent(
            handleRovingFocus({ dom: containerRef, selected: pressed }),
            theirOnFocus,
          )}
          onKeyDown={composeEvent(handleRovingKeyDown, theirOnKeyDown)}
          tabIndex={0}
          // 이 컴포넌트는 반드시, `focus` 될 수 있어야 합니다.
          // 접근성으로 인해 포커스가 되는 즉시 내부의 요소에 포커스가 이동합니다.
          ref={mergeRefs([containerRef, ref])}
          {...restProps}
        >
          {children}
        </Tag>
      );
    },
  );

// ---------

export const Item: Poly.Component<typeof DEFAULT_ITEM, ItemProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof DEFAULT_ITEM>(
      props: Poly.Props<T, ItemProps>,
      ref: Poly.Ref<T>,
    ) => {
      const { children, value, disabled = false, ...restProps } = props;
      const ItemRef = React.useRef<HTMLButtonElement>(null);

      const { pressedValue, multiple, setValue, deleteValue } = useSafeContext(
        ToggleContext,
        ITEM_DISPLAY_NAME,
      );

      const { useRegister } = useRoving();

      useRegister(value, {
        dom: ItemRef,
        value,
        disabled,
      });
      ....
      // item 요소에서 register를 진행합니다.

```
