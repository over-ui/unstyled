import * as React from 'react';

import { useControlled } from '@over-ui/use-controlled';
import { Poly, useSafeContext } from '@over-ui/core';
import { useOutsideClick } from '@over-ui/use-outside-click';

import { SelectState, reducer, SelectAction } from './reducer';

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
  setValue(value: string): void;
  dispatch: React.Dispatch<SelectAction>;
};

const StateContext = React.createContext<StateContextType | null>(null);
const ActionContext = React.createContext<ActionContextType | null>(null);

export const useActionContext = (displayName: string) => useSafeContext(ActionContext, displayName);
export const useStateContext = (displayName: string) => useSafeContext(StateContext, displayName);

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
      dispatch({ type: 'CLOSE_OPTIONS' })
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

    const onChange = (value: string) => {
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
    };

    const setValue = (value: string) => {
      dispatch({ type: 'SELECT_VALUE', payload: value });
      onChange(value);
    };

    const Tag = as || DEFAULT_ROOT;

    return (
      <>
        <StateContext.Provider value={stateValue}>
          <ActionContext.Provider
            value={{
              setValue,
              dispatch,
            }}
          >
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

const SelectRoot = Root;

export { SelectRoot, Root };
