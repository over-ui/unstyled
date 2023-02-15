import { useControlled } from '@over-ui/use-controlled';
import { mergeRefs } from '@over-ui/merge-refs';
import { Poly, composeEvent, useSafeContext } from '@over-ui/core';
import { useId } from '@over-ui/use-id';
import { useOutsideClick } from '@over-ui/use-outside-click';
import * as React from 'react';

import { SelectState, reducer, FocusMode, RegisterProps } from './reducer';

// ------------------------------------------------------------------------------
// context

interface StateContextType extends SelectState {
  /**
   * trigger component에 부착될 ref입니다.
   */
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  /**
   * options component에 부착될 ref입니다.
   */
  optionsRef: React.MutableRefObject<HTMLUListElement | null>;

  // ref를 context에서 선언하고 내려준 이유는, options 컴포넌트와 trigger 컴포넌트의
  // `DOM`에 직접 접근을 하는 경우가 많고, 이를 위해 `context`에서 생성 후 내려주는 것이
  // 가장 합리적이라고 생각했기 때문입니다.
  // (반대로, 각 컴포넌트에서 생성했다면 이 `ref`를 다시 `context`로 올려주는 과정을 거쳐야 합니다.)
}

type ActionContextType = {
  dispatchFocus(mode: FocusMode): void;
  onToggleOpen(): void;
  openOptions(): void;
  closeOptions(): void;
  setValue(value: string): void;
  registerOption(payload: { key: string; props: RegisterProps }): void;
  unRegisterOption(payload: string): void;
  registerLabel(payload: string): void;
};

const StateContext = React.createContext<StateContextType | null>(null);
const ActionContext = React.createContext<ActionContextType | null>(null);

export type RootProps<T> = {
  children?: React.ReactNode;

  /**
   * 외부에서 선언한 상태를 이용할때 사용합니다.
   * `defaultSelected`와 함께 사용할 수 없습니다. `onSelectChange` 를 함께 사용해야합니다. |
   */
  selected?: T;

  /**
   * 선택된 defaultSelected 초기값을 지정합니다.
   * `selected`와 함께 사용할 수 없습니다.
   * `onSelectChange`와 함께 사용할 수 있습니다.
   */
  defaultSelected?: T;

  /**
   * 선택된 `value`가 달라질때, 실행되는 함수입니다.
   */
  onSelectChange?(value: T): void;
  /**
   * `Select.Options`의 `open`의 초기 상태를 지정합니다.
   * @defaultValue - false
   */
  defaultOpen?: boolean;

  /**
   * `Select`의 표시 방향의 접근성을 지정해 주는 프로퍼티입니다.
   * `aria-orientation`에 적용되며 해당 값에 따라
   * `keyboard support`의 방향이 달라집니다.
   *
   * @defaultValue - 'vertical'
   * @see aria-orientation
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * `multiple`이 `true`라면, 여러개를 동시에 선택할 수 있습니다.
   * @defaultValue - false'
   */
  multiple?: boolean;

  /**
   * `form`과 함께 사용할 때에, 지정하며 `form data`의 `key`값이 됩니다.
   */
  name?: string;
};

const DEFAULT_ROOT = 'div';
const ROOT_DISPLAY_NAME = 'Select.Root';

type RootComponent = (<T, RootTag extends React.ElementType = typeof DEFAULT_ROOT>(
  props: Poly.PropsWithRef<RootTag, RootProps<T>>
) => React.ReactElement | null) & {
  displayName?: string;
};

const Root: RootComponent = React.forwardRef(
  <T, RootTag extends React.ElementType = typeof DEFAULT_ROOT>(
    props: Poly.Props<RootTag, RootProps<T>>,
    ref: Poly.Ref<RootTag>
  ) => {
    const {
      name,
      multiple = false,
      children,
      defaultOpen = false,
      selected,
      defaultSelected = (multiple ? [] : undefined) as unknown as T,
      onSelectChange,
      orientation = 'vertical',
      as,
      ...restProps
    } = props;

    const [selectedValue, setSelectedValue] = useControlled({
      value: selected,
      defaultValue: defaultSelected,
      valueOnChange: onSelectChange,
    });

    /**
     * 내부적으로, string[] 타입만을 이용하기 위한 함수입니다.
     * @return string[]
     */
    const valueToArray = () => {
      let selectedByArray;

      selectedByArray = multiple ? defaultSelected : [defaultSelected];

      if (selected) {
        selectedByArray = multiple ? selected : [selected];
      }
      // selected가 존재한다면, defaultSelected는 무시됩니다.

      return selectedByArray as string[];
    };

    const [selectState, dispatch] = React.useReducer(reducer, {
      isOpen: defaultOpen,
      option: new Map(),
      activeId: '',
      possibleOptions: [],
      currentSelectedValue: valueToArray(),
      data: {
        multiple,
        orientation,
      },
    });
    const optionsRef = React.useRef<HTMLUListElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    // 바깥을 클릭했을때, select를 닫히게 하는 effect입니다.
    useOutsideClick([optionsRef.current as HTMLElement, triggerRef.current as HTMLElement], () =>
      closeOptions()
    );

    const stateValue = React.useMemo(() => {
      return {
        ...selectState,
        optionsRef,
        triggerRef,
      };
    }, [selectState]);

    //  onSelectChange를 지원하기 위한 함수입니다.
    //  `reducer`에서 모든 로직을 처리하기는 방향으로 작성했고, `selectedValue` 또한 내부적으로는 `string[]` 타입만을 사용하고 싶었습니다.
    //  이러한 상황에서 사용자의 onSelectChange를 원활하게 지원하기 위해 아래 함수가 필요했습니다.

    const onChange = React.useCallback(
      (value: string) => {
        const isSelected = multiple
          ? (selectedValue as string[]).includes(value)
          : selectedValue === value;

        if (multiple) {
          isSelected
            ? setSelectedValue((prev) => (prev as string[]).filter((item) => item !== value) as T)
            : setSelectedValue((prev) => [...(prev as string[]), value] as T);
        } else {
          isSelected ? setSelectedValue('' as T) : setSelectedValue(value as T);
        }
      },
      [multiple, selectedValue, setSelectedValue]
    );

    const setValue = React.useCallback(
      (value: string) => {
        dispatch({ type: 'SELECT_VALUE', payload: value });
        onChange(value);
      },
      [onChange]
    );

    const onToggleOpen = React.useCallback(() => {
      dispatch({ type: 'TOGGLE_OPTIONS' });
    }, []);

    const openOptions = React.useCallback(() => {
      dispatch({ type: 'OPEN_OPTIONS' });
    }, []);

    const closeOptions = React.useCallback(() => {
      dispatch({ type: 'CLOSE_OPTIONS' });
    }, []);

    const dispatchFocus = React.useCallback((mode: FocusMode) => {
      dispatch({ type: 'FOCUS', mode });
    }, []);

    const registerOption = React.useCallback((payload: { key: string; props: RegisterProps }) => {
      dispatch({ type: 'REGISTER_OPTION', payload });
    }, []);

    const unRegisterOption = React.useCallback((payload: string) => {
      dispatch({ type: 'UN_REGISTER_OPTION', payload: payload });
    }, []);

    const registerLabel = React.useCallback((payload: string) => {
      dispatch({ type: 'REGISTER_LABEL', payload });
    }, []);

    const actions = React.useMemo(() => {
      return {
        dispatchFocus,
        onToggleOpen,
        openOptions,
        closeOptions,
        registerOption,
        unRegisterOption,
        registerLabel,
        setValue,
      };
    }, [
      dispatchFocus,
      onToggleOpen,
      openOptions,
      closeOptions,
      setValue,
      registerOption,
      unRegisterOption,
      registerLabel,
    ]);

    const Tag = as || DEFAULT_ROOT;

    return (
      <>
        <StateContext.Provider value={stateValue}>
          <ActionContext.Provider value={actions}>
            <Tag ref={ref} {...restProps}>
              {children}
            </Tag>
          </ActionContext.Provider>
        </StateContext.Provider>
        {name && (
          <input type="hidden" defaultValue={selectedValue as string | string[]} name={name} />
        )}
      </>
    );
  }
);

Root.displayName = ROOT_DISPLAY_NAME;

// `Label`태그는, 다른 태그로 바뀌지 않아야 된다고 생각해 `Poly`를 적용하지 않았습니다.
interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  /**
   * Label을 clip-pattern으로 안보이게 감출 수 있는 속성입니다.
   * @defaultValue - false
   */
  hidden?: boolean;
}

const LABEL_DISPLAY_NAME = 'Select.Label';
const Label = (props: LabelProps) => {
  const { children, hidden = false } = props;
  const id = React.useId();
  const { registerLabel } = useSafeContext(ActionContext, LABEL_DISPLAY_NAME);

  React.useEffect(() => {
    registerLabel(id);
  }, [id, registerLabel]);

  const style = hidden
    ? ({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      } as React.CSSProperties)
    : undefined;
  return (
    <label id={id} style={style}>
      {children}
    </label>
  );
};

Label.displayName = LABEL_DISPLAY_NAME;

// ------------------------------------------------------------------------------ //
// Select.Trigger

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

    const { triggerRef, optionsRef, isOpen, labelId, data, currentSelectedValue } = useSafeContext(
      StateContext,
      TRIGGER_DISPLAY_NAME
    );
    const { onToggleOpen, openOptions, closeOptions } = useSafeContext(
      ActionContext,
      TRIGGER_DISPLAY_NAME
    );

    const handleClick = () => {
      onToggleOpen();
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
          openOptions();
          break;
        }

        case CLOSE.includes(e.key): {
          closeOptions();
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

// ------------------------------------------------------------------------------ //
// Select.Options

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
    const { optionsRef, data, isOpen, labelId } = useSafeContext(
      StateContext,
      OPTIONS_DISPLAY_NAME
    );
    const Tag = as || DEFAULT_OPTIONS;
    const { dispatchFocus } = useSafeContext(ActionContext, OPTIONS_DISPLAY_NAME);

    React.useEffect(() => {
      dispatchFocus('INIT');
    }, [isOpen, dispatchFocus]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const { HOME, END, ARROW } = OPTIONS_KEYS;
      const { NEXT, PREV } = ARROW[data.orientation];

      switch (e.key) {
        case HOME: {
          dispatchFocus('FIRST');
          break;
        }

        case END: {
          dispatchFocus('LAST');
          break;
        }

        case NEXT: {
          dispatchFocus('NEXT');
          break;
        }

        case PREV: {
          dispatchFocus('PREV');
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

// ------------------------------------------------------------------------------ //
// Select.Option

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
    const { triggerRef, activeId, isOpen, data, currentSelectedValue } = useSafeContext(
      StateContext,
      OPTION_DISPLAY_NAME
    );
    const { closeOptions, setValue, registerOption, unRegisterOption } = useSafeContext(
      ActionContext,
      OPTION_DISPLAY_NAME
    );
    const id = useId();

    React.useEffect(() => {
      if (!optionRef.current) return;
      registerOption({
        key: value,
        props: {
          id: id,
          dom: optionRef.current,
          value,
          disabled,
        },
      });

      return () => {
        unRegisterOption(value);
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Tag = as || DEFAULT_OPTION;

    const isSelected = currentSelectedValue.includes(value);

    const handleClick = () => {
      if (disabled) return;
      setValue(value);
      if (!data.multiple) closeOptions();
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
          closeOptions();
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

export { Root, Label, Trigger, Options, Option };
