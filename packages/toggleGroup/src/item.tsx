import * as React from 'react';

import { Poly, useSafeContext } from '@over-ui/core';

import { mergeRefs } from '@over-ui/merge-refs';
import { Toggle, ToggleProps } from '@over-ui/toggle';
import { ToggleContext, useRoving } from './root';

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

const ToggleGroupItem = Item;
export { ToggleGroupItem, Item };
