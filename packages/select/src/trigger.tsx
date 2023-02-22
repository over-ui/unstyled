import * as React from 'react';

import { composeEvent, Poly } from '@over-ui/core';
import { mergeRefs } from '@over-ui/merge-refs';
import { useId } from '@over-ui/use-id';

import { useActionContext, useStateContext } from './root';

type TriggerRenderProps = {
  open: boolean;
  selectedValue: string | string[];
};

type TriggerProps = {
  children?: React.ReactNode | ((props: TriggerRenderProps) => React.ReactNode);

  /**
   * 사용자가 직접 label Id를 지정하고 싶을때 사용합니다.
   */
  labelledby?: string;
};

const DEFAULT_TRIGGER = 'button';
const TRIGGER_DISPLAY_NAME = 'Select.Trigger';
const TRIGGER_KEYS = {
  TOGGLE: ['Enter', ' '],
  OPEN: ['ArrowDown', 'ArrowUp'],
  CLOSE: ['Escape'],
};

const Trigger: Poly.Component<typeof DEFAULT_TRIGGER, TriggerProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_TRIGGER>(
    props: Poly.Props<T, TriggerProps>,
    forwardRef: Poly.Ref<T>
  ) => {
    const {
      children,
      labelledby,
      as,
      onClick: theirOnClick,
      onKeyDown: theirOnKeyDown,
      ...restProps
    } = props;

    const Tag = as || DEFAULT_TRIGGER;

    const { triggerRef, optionsRef, isOpen, labelId, data, currentSelectedValue } =
      useStateContext(TRIGGER_DISPLAY_NAME);
    const { dispatch } = useActionContext(TRIGGER_DISPLAY_NAME);

    const handleClick = () => {
      dispatch({ type: 'TOGGLE_OPTIONS' });
    };

    const handleKeyup = (e: React.KeyboardEvent) => {
      const { TOGGLE, OPEN, CLOSE } = TRIGGER_KEYS;
      switch (true) {
        case TOGGLE.includes(e.key): {
          e.preventDefault();
          handleClick();
          break;
        }

        case OPEN.includes(e.key): {
          dispatch({ type: 'OPEN_OPTIONS' });
          break;
        }

        case CLOSE.includes(e.key): {
          dispatch({ type: 'CLOSE_OPTIONS' });
          break;
        }

        default:
          break;
      }
    };

    const renderProps = {
      open: isOpen,
      selectedValue: data.multiple
        ? (currentSelectedValue as string[])
        : (currentSelectedValue.join() as string),
    };

    const id = useId();
    return (
      <Tag
        type="button"
        id={id}
        role="combobox"
        aria-controls={optionsRef.current?.id}
        aria-expanded={isOpen}
        aria-labelledby={labelledby ?? labelId}
        // Select.Label을 사용하지 않는 경우 사용자가 만든 label의 id를 받아올 수 있도록 합니다.
        // 사용자의 custom labelledby를 우선합니다.
        aria-haspopup="listbox"
        ref={mergeRefs([triggerRef, forwardRef])}
        onClick={composeEvent(handleClick, theirOnClick)}
        onKeyDown={composeEvent(handleKeyup, theirOnKeyDown)}
        tabIndex={0}
        {...restProps}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Tag>
    );
  }
);

Trigger.displayName = TRIGGER_DISPLAY_NAME;

const SelectTrigger = Trigger;

export { SelectTrigger, Trigger };
