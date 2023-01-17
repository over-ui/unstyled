/* eslint-disable react/prop-types */
import * as React from 'react';
import * as RovingUtils from './utils';

const { getCurrentFocused, getComputedIndex, setNodeFocusable, setNodeUnFocusable, setNodeFocus } =
  RovingUtils;

const ROVING_KEYS = {
  NEXT: ['ArrowRight', 'ArrowUp'],
  PREV: ['ArrowLeft', 'ArrowDown'],
  HOME: ['Home'],
  END: ['End'],
  CLOSE: ['Tab'],
};

type RovingContext = {
  /**
   * roving focus가 필요한 요소들의 dom, value, disabled를 모으기 위한 hook입니다.
   */
  useRegister: (
    id: string,
    props: {
      dom: React.RefObject<HTMLElement>;
      value: string;
      disabled: boolean;
    }
  ) => void;

  /**
   * roving focus의 keyboard navigation을 지원하는 함수입니다.
   * `roving` 요소들을 묶고 있는 `group` 요소에서 사용합니다.
   */
  handleRovingKeyDown: (e: React.KeyboardEvent) => void;

  /**
   * roving focus를 초기화해주는 함수입니다.
   *
   * 요소들을 묶고 있는 `role`이 `group`인 컴포넌트의 `focus`이벤트로 등록합니다.
   *
   * `selected`가 존재한다면, `selected` 요소를 없다면 첫번째 요소의 `tabIndex`가 0이 됩니다.
   */
  handleRovingFocus: (props: {
    dom: React.RefObject<HTMLElement>;
    selected?: string | string[];
  }) => (e: React.FocusEvent) => void;
};

export const createRovingContext = () => {
  const RovingContext = React.createContext<RovingContext | null>(null);

  const RovingProvider = (props: { children: React.ReactNode }) => {
    const { children } = props;
    const rovingItems = React.useRef(new Map()).current;

    const getItems = React.useCallback(() => {
      return Array.from(rovingItems.values()).filter((item) => !item.disabled);
    }, [rovingItems]);

    const useRegister: RovingContext['useRegister'] = (id, props) => {
      const { dom, value, disabled } = props;
      React.useEffect(() => {
        rovingItems.set(id, {
          dom,
          value,
          disabled,
        });

        return () => {
          rovingItems.delete(id);
        };
      }, [value, disabled, dom, id]);
    };
    // 내부적으로 React.useEffect를 담고 있는 커스텀훅이되어,
    // useCallback으로 묶지 않았습니다.
    // 다만, register에만 사용되므로 문제는 없었습니다.

    const handleRovingKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        const { key } = e;
        const items = getItems().map((item) => item.dom.current);
        const currentFocusedIndex = getCurrentFocused(items);
        const currentFocusedNode = items[currentFocusedIndex];
        const [nextIndex, prevIndex] = getComputedIndex(currentFocusedIndex, items.length);

        switch (true) {
          case ROVING_KEYS.NEXT.includes(key): {
            const nextNode = items[nextIndex];
            setNodeUnFocusable(currentFocusedNode);
            setNodeFocusable(nextNode);
            setNodeFocus(nextNode);
            break;
          }

          case ROVING_KEYS.PREV.includes(key): {
            const prevNode = items[prevIndex];
            setNodeUnFocusable(currentFocusedNode);
            setNodeFocusable(prevNode);
            setNodeFocus(prevNode);
            break;
          }
          case ROVING_KEYS.HOME.includes(key): {
            setNodeUnFocusable(currentFocusedNode);
            setNodeFocusable(items[0]);
            setNodeFocus(items[0]);
            break;
          }
          case ROVING_KEYS.END.includes(key): {
            setNodeUnFocusable(currentFocusedNode);
            setNodeFocusable(items[items.length - 1]);
            setNodeFocus(items[items.length - 1]);
            break;
          }
          case ROVING_KEYS.CLOSE.includes(key): {
            items.forEach(setNodeUnFocusable);
            break;
          }

          default:
            break;
        }
      },
      [getItems]
    );

    const handleRovingFocus: RovingContext['handleRovingFocus'] = React.useCallback(
      ({ dom, selected }) =>
        (e: React.FocusEvent) => {
          if (e.target !== dom.current) return;
          const items = getItems();

          const selectedIndex = Array.isArray(selected)
            ? items.findIndex((item) => selected.includes(item.value))
            : items.findIndex((item) => item.value === selected);

          const computedIndex = selectedIndex === -1 ? 0 : selectedIndex;
          const targetNode = items[computedIndex].dom.current;

          items.forEach((item) => setNodeUnFocusable(item.dom.current));
          setNodeFocusable(targetNode);
          setNodeFocus(targetNode);
        },
      [getItems]
    );

    const value = React.useMemo(() => {
      return { handleRovingKeyDown, useRegister, getItems, handleRovingFocus };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleRovingKeyDown, getItems, handleRovingFocus]);

    return <RovingContext.Provider value={value}>{children}</RovingContext.Provider>;
  };

  const useRoving = () => {
    const context = React.useContext(RovingContext);
    if (!context) throw Error('useRovingContext should be used wrapped with RovingProvider');

    return context;
  };

  RovingContext.displayName = 'RovingContext';
  return { RovingProvider, useRoving };
};
