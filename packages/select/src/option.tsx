import * as React from 'react';

import { mergeRefs } from '@over-ui/merge-refs';
import { Poly, composeEvent } from '@over-ui/core';
import { useId } from '@over-ui/use-id';

import { useActionContext, useStateContext } from './root';

type OptionRenderProps = {
  active: boolean;
  disabled: boolean;
  selected: boolean;
};

type OptionProps = {
  children?: React.ReactNode | ((props: OptionRenderProps) => React.ReactNode);

  /**
   * `value` 프로퍼티는 해당 옵션을 나타냅니다.
   * 각 옵션을 구분할 때 사용되므로, 반드시 필요하며 유니크한 값이 등록되어야 합니다.
   */
  value: string;

  /**
   * 해당 옵션이 선택 가능한지의 여부를 나타냅니다.
   * @defaultValue - false
   */
  disabled?: boolean;
};

const DEFAULT_OPTION = 'li';
const OPTION_DISPLAY_NAME = 'Select.Option';
const OPTION_KEYS = {
  SELECT: ['Enter', ' '],
  CLOSE: ['Escape'],
  DISABLED: ['Tab'],
};

const Option: Poly.Component<typeof DEFAULT_OPTION, OptionProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_OPTION>(
    props: Poly.Props<T, OptionProps>,
    forwardRef: Poly.Ref<T>
  ) => {
    const {
      children,
      value,
      disabled = false,
      onClick: theirOnClick,
      onKeyDown: theirOnKeyDown,
      as,
      ...restProps
    } = props;

    const optionRef = React.useRef<HTMLLIElement>(null);
    const { triggerRef, activeId, isOpen, data, currentSelectedValue } =
      useStateContext(OPTION_DISPLAY_NAME);
    const { setValue, dispatch } = useActionContext(OPTION_DISPLAY_NAME);
    const id = useId();

    React.useEffect(() => {
      if (!optionRef.current) return;
      dispatch({
        type: 'REGISTER_OPTION',
        payload: {
          key: value,
          props: {
            id: id,
            dom: optionRef.current,
            value,
            disabled,
          },
        },
      });

      return () => {
        dispatch({ type: 'UN_REGISTER_OPTION', payload: value });
      };
    }, []);

    const Tag = as || DEFAULT_OPTION;

    const isSelected = currentSelectedValue.includes(value);

    const handleClick = () => {
      if (disabled) return;
      setValue(value);
      if (!data.multiple) dispatch({ type: 'CLOSE_OPTIONS' });
      // setValue에 합치는 방법도 있겠지만, 함수의 역할을 줄이고 싶어서 따로 진행
    };

    const renderProps = {
      active: activeId === id,
      disabled,
      selected: isSelected,
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const { SELECT, DISABLED, CLOSE } = OPTION_KEYS;
      switch (true) {
        case SELECT.includes(e.key): {
          e.preventDefault();
          // enter 이벤트가 click이벤트를 불러오는 것을 방지
          e.stopPropagation();
          // ul에 있는, 이벤트 핸들러가 실행되지 않기 위해서
          handleClick();
          if (!data.multiple) triggerRef.current?.focus();
          break;
        }

        case DISABLED.includes(e.key): {
          e.preventDefault();
          break;
        }

        case CLOSE.includes(e.key): {
          e.stopPropagation();
          dispatch({ type: 'CLOSE_OPTIONS' });
          triggerRef.current?.focus();

          break;
        }

        default:
          break;
      }
    };

    return (
      <Tag
        ref={mergeRefs([forwardRef, optionRef])}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled ? true : undefined}
        id={id}
        data-selected={isSelected}
        data-disabled={disabled}
        data-active={activeId === id}
        tabIndex={isOpen && !disabled ? 0 : undefined}
        onClick={composeEvent(handleClick, theirOnClick)}
        onKeyDown={composeEvent(handleKeyDown, theirOnKeyDown)}
        {...restProps}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Tag>
    );
  }
);

Option.displayName = OPTION_DISPLAY_NAME;

const SelectOption = Option;

export { SelectOption, Option };
