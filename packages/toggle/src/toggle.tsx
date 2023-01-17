import * as React from 'react';
import { Poly, composeEvent } from '@over-ui/core';
import { useControlled } from '@over-ui/use-controlled';

export type ToggleRenderProps = {
  /**
   * children을 render할때 사용할 수 있는 renderProps 입니다. @example
   * ```tsx
   * <Toggle>{({ pressed }) => (pressed ? 'pressed' : 'notPressed')}</Toggle>
   * // pressed 값에 따라, 다른 컴포넌트, string, 아이콘을 조건부 렌더링할 수 있습니다.
   * ```
   */
  pressed: boolean;
  disabled: boolean;
};

export type ToggleProps = {
  /**
   *  외부에서 선언한 상태를 이용할때 사용합니다.
   *  `defaultPressed`와 함께 사용할 수 없습니다.
   *  `onPressedChange` 를 함께 사용해야합니다.
   *
   * @example
   * ```tsx
   * const [state, setState] = React.useState(false);
   * return <Toggle pressed={state} onPressedChange={setState}/>
   * ```
   */
  pressed?: boolean;

  /**
   * `Toggle`의 `pressed` 상태의 초기값을 지정합니다.
   * `pressed`와 함께 사용할 수 없습니다.
   * `onPressedChange`와 함께 사용할 수 있습니다.
   *  @defaultValue false
   */
  defaultPressed?: boolean;

  /**
   *  `Toggle`의 상태가 바뀔때 실행되는 함수입니다.
   */
  onPressedChange?: (pressed: boolean) => void;

  /**
   * 토글을 `disabled`하는 prop입니다.
   * @defaultValue false
   */
  disabled?: boolean;
  children?: React.ReactNode | ((props: ToggleRenderProps) => React.ReactNode);
};

const DEFAULT_TOGGLE = 'button';
const TOGGLE_DISPLAY_NAME = 'Toggle';
const TOGGLE_KEYS = ['Enter', ' '];

export const Toggle: Poly.Component<typeof DEFAULT_TOGGLE, ToggleProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_TOGGLE>(
    props: Poly.Props<T, ToggleProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const {
      onClick: theirOnClick,
      onKeyDown: theirOnKeyDown,
      onPressedChange,
      disabled = false,
      children,
      defaultPressed = false,
      pressed: pressedProp,
      as,
      ...restProps
    } = props;
    const Tag = as || DEFAULT_TOGGLE;

    const [pressed, setPressed] = useControlled({
      value: pressedProp,
      defaultValue: defaultPressed,
      valueOnChange: onPressedChange,
    });

    const renderProps = {
      pressed,
      disabled,
    };

    const handleClick = () => {
      if (disabled) return;
      setPressed(!pressed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!TOGGLE_KEYS.includes(e.key)) return;
      e.preventDefault();
      // button 이외 다른 태그 사용할 수 있으므로 button 태그의 기본 이벤트를 막고, 새로운 이벤트를 추가했습니다.
      handleClick();
    };

    return (
      <Tag
        ref={forwardedRef}
        type="button"
        // form과 함께 사용될 경우, submit으로 사용되지 않게 하기 위해
        onClick={composeEvent(handleClick, theirOnClick)}
        onKeyDown={composeEvent(handleKeyDown, theirOnKeyDown)}
        data-pressed={pressed ? 'on' : 'off'}
        data-disabled={disabled ? true : undefined}
        disabled={disabled ? true : undefined}
        role="button"
        tabIndex={disabled ? undefined : 0}
        aria-pressed={pressed}
        aria-disabled={disabled}
        {...restProps}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Tag>
    );
  }
);

Toggle.displayName = TOGGLE_DISPLAY_NAME;
