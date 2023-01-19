import * as React from 'react';

import { composeEvent, Poly, useSafeContext } from '@over-ui/core';
import { useControlled } from '@over-ui/use-controlled';
import { mergeRefs } from '@over-ui/merge-refs';
import { Toggle, ToggleProps } from '@over-ui/toggle';
import { createRovingContext } from '@over-ui/create-roving-context';

const { RovingProvider, useRoving } = createRovingContext();

// ------------------------------------------------------------------------------
// ToggleGroup.Root

type PressedValue = string | string[];

type ToggleContextType = {
  multiple: boolean;
  setValue(value: PressedValue): void;
  deleteValue(value: PressedValue): void;
  getIsPressed(value: string): boolean;
};

const ToggleContext = React.createContext<ToggleContextType | null>(null);
ToggleContext.displayName = 'ToggleContext';

type RootProps<T> = {
  children: React.ReactNode;
  /**
   *  외부에서 선언한 상태를 이용할때 사용합니다.
   *  `defaultValue`와 함께 사용할 수 없습니다.
   *  `onValueChange` 를 함께 사용해야합니다.
   */
  value?: T;

  /**
   *  선택된 value의 초기값을 지정합니다.
   * `value`와 함께 사용할 수 없습니다.
   * `onValueChange`와 함께 사용할 수 있습니다.
   *  @defaultValue false
   */
  defaultValue?: T;

  /**
   * 선택된 `value`가 달라질때, 실행되는 함수입니다.
   */
  onValueChange?(value: T): void;

  /**
   * form control을 할때 사용하는 프로퍼티입니다.
   * 여기서 설정한 이름이, form data의 name이 됩니다.
   */
  name?: string;

  /**
   * 여러개의 toggle을 동시에 선택할 수 있도록 하는 프로퍼티입니다.
   * @defaultValue false
   */
  multiple?: boolean;
};

const DEFAULT_ROOT = 'div';

type RootComponent = (<P extends React.ElementType, T>(
  props: Poly.PropsWithRef<P, RootProps<T>>
) => React.ReactElement | null) & {
  displayName?: string;
};

// RootProps에서 제네릭을 필요로 하고, 이 제네릭을 Value으로 한정짓기 위해
// Poly.Component를 사용하지 않고 새로운 타입을 만들었습니다.

const Root: RootComponent = React.forwardRef(
  <T, C extends React.ElementType = typeof DEFAULT_ROOT>(
    props: Poly.Props<C, RootProps<T>>,
    ref: Poly.Ref<C>
  ) => {
    const {
      onValueChange,
      children,
      multiple = false,
      value: pressedProp,
      defaultValue = multiple ? ([] as unknown as T) : undefined,
      name,
      ...restProps
    } = props;

    if (multiple && pressedProp && !Array.isArray(pressedProp)) {
      throw new Error('type multiple should be used with Array type. check value property');
    }
    if (multiple && !Array.isArray(defaultValue)) {
      throw new Error('type multiple should be used with Array type. check defaultValue property');
    }

    const [pressedValue, setPressedValue] = useControlled({
      value: pressedProp,
      defaultValue: defaultValue,
      valueOnChange: onValueChange,
    });

    const setValue = (value: string | string[]) => {
      if (multiple) setPressedValue((prev) => [...(prev as string[]), value] as T);
      else setPressedValue(value as T);
    };

    const deleteValue = (value: string | string[]) => {
      if (multiple) {
        setPressedValue((prev) => (prev as string[]).filter((item) => item !== value) as T);
      } else setPressedValue('' as T);
    };

    const getIsPressed = (value: string) => {
      if (multiple && Array.isArray(pressedValue)) return pressedValue.includes(value);
      return pressedValue === value;
    };
    // TO-DO
    // string | string[] 타입을 억지로, 두가지 타입을 모두 받을 수 있게 한 부분이
    // 가독성이 떨어진다고 느껴집니다.
    // 내부적으로는 string[] 타입만을 받는 방향으로 수정할 예정입니다.

    const value = {
      multiple,
      setValue,
      deleteValue,
      getIsPressed,
    };

    return (
      <React.Fragment>
        <ToggleContext.Provider value={value}>
          <RovingProvider>
            <Container {...restProps} pressed={pressedValue} ref={ref}>
              {children}
            </Container>
          </RovingProvider>
        </ToggleContext.Provider>
        {name && (
          <input type="hidden" name={name} defaultValue={pressedValue as string | string[]} />
        )}
      </React.Fragment>
    );
  }
);

Root.displayName = 'ToggleGroup.Root';

// ------------------------------------------------------------------------------
// Container used in Root Component

type ContainerProps<T> = {
  children: React.ReactNode;
  pressed: T;
};

type ContainerComponent = (<P extends React.ElementType, T>(
  props: Poly.PropsWithRef<P, ContainerProps<T>>
) => React.ReactElement | null) & {
  displayName?: string;
};

const Container: ContainerComponent = React.forwardRef(
  <C extends string | string[], T extends React.ElementType = typeof DEFAULT_ROOT>(
    props: Poly.Props<T, ContainerProps<C>>,
    ref: Poly.Ref<T>
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
    const Tag = as || DEFAULT_ROOT;
    const { handleRovingKeyDown, handleRovingFocus } = useRoving();

    return (
      <Tag
        role="group"
        onFocus={composeEvent(
          handleRovingFocus({ dom: containerRef, selected: pressed }),
          theirOnFocus
        )}
        onKeyDown={composeEvent(handleRovingKeyDown, theirOnKeyDown)}
        tabIndex={0}
        // 이 컴포넌트는 반드시, `focus` 될 수 있어야 합니다.
        // 이 컴포넌트에서 focus될 경우, tabindex를 초기화 하고 첫 요소 또는 checked 된 요소로 포커스가 이동됩니다.

        ref={mergeRefs([containerRef, ref])}
        {...restProps}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = 'ToggleGroup.Container';

// ------------------------------------------------------------------------------
// ToggleGroup.Item

const DEFAULT_ITEM = 'button';
const ITEM_DISPLAY_NAME = 'ToggleGroup.Item';

type ItemProps = Omit<ToggleProps, 'pressed' | 'onPressedChange' | 'defaultPressed'> & {
  /**
   * item의 value를 지정합니다.
   */
  value: string;
};

const Item: Poly.Component<typeof DEFAULT_ITEM, ItemProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_ITEM>(
    props: Poly.Props<T, ItemProps>,
    ref: Poly.Ref<T>
  ) => {
    const { children, value, disabled = false, ...restProps } = props;
    const ItemRef = React.useRef<HTMLButtonElement>(null);

    const { multiple, setValue, deleteValue, getIsPressed } = useSafeContext(
      ToggleContext,
      ITEM_DISPLAY_NAME
    );

    const { useRegister } = useRoving();

    useRegister(value, {
      dom: ItemRef,
      value,
      disabled,
    });

    const pressed = getIsPressed(value);
    const ariaAttrs = multiple
      ? {}
      : {
          role: 'radio',
          'aria-checked': pressed,
          'aria-pressed': undefined,
        };

    return (
      <Toggle
        type="button"
        tabIndex={-1}
        pressed={pressed}
        onPressedChange={(pressed) => {
          pressed ? setValue(value) : deleteValue(value);
        }}
        disabled={disabled}
        ref={mergeRefs([ItemRef, ref])}
        {...ariaAttrs}
        {...restProps}
      >
        {children}
      </Toggle>
    );
  }
);

Item.displayName = 'ToggleGroup.Item';

export { Root, Item };
