export type SelectState = {
  isOpen: boolean;
  option: Map<string, RegisterProps>;
  possibleOptions: RegisterProps[];
  activeId: string;
  /**
   * activeIndex는 현재 `focus`되어 있는 요소의 `index`를 나타냅니다.
   * 추후, 접근성 지원을 `aria-activedescendant`을 이용하는 방법으로
   * 전환할 가능성이 있어 추가했습니다.
   *
   * @see [ARIA Authoring Practices Guide (APG) - listbox](https://w3c.github.io/aria/#aria-activedescendant)
   */
  data: {
    multiple: boolean;
    orientation: 'vertical' | 'horizontal';
  };
  labelId?: string;
  currentSelectedValue: string[];
};

export type RegisterProps = {
  dom: HTMLElement;
  disabled?: boolean;
  value: string;
  id: string;
};

export type FocusMode = 'INIT' | 'NEXT' | 'PREV' | 'FIRST' | 'LAST';
export type SelectAction =
  | {
      type: 'TOGGLE_OPTIONS';
    }
  | { type: 'OPEN_OPTIONS' }
  | { type: 'CLOSE_OPTIONS' }
  | {
      type: 'REGISTER_OPTION';
      payload: {
        key: string;
        props: RegisterProps;
      };
    }
  | {
      type: 'UN_REGISTER_OPTION';
      payload: string;
    }
  | { type: 'FOCUS'; mode: FocusMode }
  | { type: 'REGISTER_LABEL'; payload: string }
  | { type: 'SELECT_VALUE'; payload: string };

export const reducer = (state: SelectState, action: SelectAction) => {
  const { type } = action;
  switch (type) {
    case 'TOGGLE_OPTIONS': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'OPEN_OPTIONS': {
      return {
        ...state,
        isOpen: true,
      };
    }

    case 'CLOSE_OPTIONS': {
      return {
        ...state,
        isOpen: false,
      };
    }

    case 'SELECT_VALUE': {
      const value = action.payload;
      const { data, currentSelectedValue } = state;
      const isMultiple = data.multiple;
      const isSelected = currentSelectedValue.includes(value);

      let newState = [];

      if (isMultiple) {
        newState = isSelected
          ? currentSelectedValue.filter((item) => item !== value)
          : [...currentSelectedValue, value];
      } else {
        newState = isSelected ? [] : [value];
      }
      return {
        ...state,
        currentSelectedValue: newState,
      };
    }

    case 'REGISTER_OPTION': {
      const { key, props } = action.payload;
      const newState = state.option.set(key, props);

      const possibleOptions = [...newState.values()].filter((item) => !item.disabled);
      return {
        ...state,
        option: newState,
        possibleOptions,
      };
    }

    case 'UN_REGISTER_OPTION': {
      const registeredOption = state.option;
      registeredOption.delete(action.payload);

      return {
        ...state,
        option: registeredOption,
      };
    }

    case 'FOCUS': {
      // FOCUS 관련 부분은 중복 코드도 많고, 사용을 위해 useCallback으로 함수를 묶을 때에도 많은 함수가 존재하는 것이
      // 불편하다고 느껴져, 내부에서 switch문을 또 한번 써 분기처리했습니다.

      const { mode } = action;
      const { possibleOptions, currentSelectedValue, activeId, isOpen } = state;
      const currentFocused = possibleOptions.findIndex((item) => item.id === activeId);

      switch (mode) {
        case 'INIT': {
          if (!isOpen) return state;

          const candidate = possibleOptions;
          const selectedIndex = candidate.findIndex((item) =>
            currentSelectedValue.includes(item.value)
          );

          const computedIndex = selectedIndex === -1 ? 0 : selectedIndex;
          const targetNode = candidate[computedIndex];
          targetNode.dom.focus();
          return {
            ...state,
            activeId: targetNode.id,
          };
        }

        case 'NEXT': {
          const computedIndex =
            currentFocused + 1 === possibleOptions.length ? currentFocused : currentFocused + 1;
          possibleOptions[computedIndex].dom.focus();

          return {
            ...state,
            activeId: possibleOptions[computedIndex].id,
          };
        }

        case 'PREV': {
          const computedIndex = currentFocused - 1 === -1 ? currentFocused : currentFocused - 1;
          possibleOptions[computedIndex].dom.focus();

          return {
            ...state,
            activeId: possibleOptions[computedIndex].id,
          };
        }

        case 'FIRST': {
          const targetNode = possibleOptions[0];
          targetNode.dom.focus();

          return {
            ...state,
            activeId: targetNode.id,
          };
        }

        case 'LAST': {
          const targetNode = possibleOptions[possibleOptions.length - 1];
          targetNode.dom.focus();

          return {
            ...state,
            activeId: targetNode.id,
          };
        }

        default: {
          return state;
        }
      }
    }

    case 'REGISTER_LABEL': {
      const id = action.payload;

      return {
        ...state,
        labelId: id,
      };
    }

    default:
      throw new Error('unhandled action type');
  }
};
