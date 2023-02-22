import * as React from 'react';

import { mergeRefs } from '@over-ui/merge-refs';
import { Poly, composeEvent } from '@over-ui/core';

import { useActionContext, useStateContext } from './root';

type OptionsProps = {
  children: React.ReactNode;
  labelledby?: string;
};

const DEFAULT_OPTIONS = 'ul';
const OPTIONS_DISPLAY_NAME = 'Select.Options';
const OPTIONS_KEYS = {
  HOME: 'Home',
  END: 'End',
  ARROW: {
    vertical: {
      NEXT: 'ArrowDown',
      PREV: 'ArrowUp',
    },
    horizontal: {
      NEXT: 'ArrowRight',
      PREV: 'ArrowLeft',
    },
  },
};

const Options: Poly.Component<typeof DEFAULT_OPTIONS, OptionsProps> = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_OPTIONS>(
    props: Poly.Props<T, OptionsProps>,
    ref: Poly.Ref<T>
  ) => {
    const id = React.useId();
    const { children, labelledby, as, onKeyDown: theirOnKeyDown, ...restProps } = props;
    const { optionsRef, data, isOpen, labelId } = useStateContext(OPTIONS_DISPLAY_NAME);
    const { dispatch } = useActionContext(OPTIONS_DISPLAY_NAME);

    const Tag = as || DEFAULT_OPTIONS;

    React.useEffect(() => {
      dispatch({ type: 'FOCUS', mode: 'INIT' });
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const { HOME, END, ARROW } = OPTIONS_KEYS;
      const { NEXT, PREV } = ARROW[data.orientation];

      switch (e.key) {
        case HOME: {
          dispatch({ type: 'FOCUS', mode: 'FIRST' });
          break;
        }

        case END: {
          dispatch({ type: 'FOCUS', mode: 'LAST' });
          break;
        }

        case NEXT: {
          dispatch({ type: 'FOCUS', mode: 'NEXT' });
          break;
        }

        case PREV: {
          dispatch({ type: 'FOCUS', mode: 'PREV' });
          break;
        }

        default:
          break;
      }
    };

    return isOpen ? (
      <Tag
        role="listbox"
        aria-labelledby={labelledby ?? labelId}
        aria-multiselectable={data.multiple}
        aria-orientation={data.orientation}
        ref={mergeRefs([optionsRef, ref])}
        id={id}
        tabIndex={isOpen ? 0 : undefined}
        onKeyDown={composeEvent(handleKeyDown, theirOnKeyDown)}
        {...restProps}
      >
        {children}
      </Tag>
    ) : null;
  }
);

Options.displayName = OPTIONS_DISPLAY_NAME;

const SelectOptions = Options;

export { SelectOptions, Options };
