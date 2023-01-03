import * as React from 'react';
import { Poly } from '@over-ui/core';

/* -------------------------------------------------------------------------------------------------
 * FocusScope
 * -----------------------------------------------------------------------------------------------*/
type FocusTrapLayerProps = {
  children?: React.ReactNode;
  loop?: boolean;
  trapped?: boolean;
};
const FOCUS_TRAP_LAYER_TAG = 'div';

const FocusTrapLayer: Poly.Component<typeof FOCUS_TRAP_LAYER_TAG, FocusTrapLayerProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof FOCUS_TRAP_LAYER_TAG>(
      props: Poly.Props<T, FocusTrapLayerProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, loop = false, trapped = true, ...FocusTrapProps } = props;
      const Tag = as || FOCUS_TRAP_LAYER_TAG;
      const [container, setContainer] = React.useState<HTMLElement | null>(null);
      const lastFocusedElementRef = React.useRef<HTMLElement | null>(null);
      const focusTrapRef = React.useRef<HTMLDivElement | null>(null);
      const document = globalThis?.document;

      const focusScope = React.useRef({
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        },
      }).current;

      React.useEffect(() => {
        setContainer(focusTrapRef.current);
      }, []);

      /* focusin, focusout handler */
      const handleFocusIn = (event: FocusEvent) => {
        if (trapped) {
          if (focusScope.paused || !container) return;
          const target = event.target as HTMLElement | null;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }
      };

      React.useEffect(() => {
        document.addEventListener('focusin', handleFocusIn);

        return () => {
          document.removeEventListener('focusin', handleFocusIn);
        };
      }, [trapped, container, focusScope.paused]);

      /* keydown handler */
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;

        const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement as HTMLElement | null;

        if (isTabKey && focusedElement) {
          if (!container) return;
          const [first, last] = getFocusableEdges(container);
          const hasFocusableEdges = first && last;

          if (!hasFocusableEdges && focusedElement === container) {
            event.preventDefault();
          }
          if (hasFocusableEdges) {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      };

      React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [loop, trapped, focusScope.paused, container]);

      React.useEffect(() => {
        if (container) {
          focusTrapLayerStack.add(focusScope);
          const previouslyFocusedElement = document.activeElement as HTMLElement | null;
          const hasFocusedElement = container.contains(previouslyFocusedElement);

          if (!hasFocusedElement) {
            focusFirst(getFocusableElements(container), container, { select: true });
          }
          return () => {
            focus(previouslyFocusedElement ?? document.body, { select: true });

            focusTrapLayerStack.remove(focusScope);
          };
        }
      }, [container]);

      return <Tag ref={focusTrapRef} tabIndex={-1} {...FocusTrapProps} />;
    }
  );

FocusTrapLayer.displayName = 'FOCUS_TRAP_LAYER';

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
function getFocusableElements(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  // TreeWalker를 사용하여 트리를 탐색
  // createTreeWalker(root, whatToShow, filter), return TreeWalker object
  // https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      //input 태그이지만 안보이는 경우 스킵
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;

      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  // 첫 번째는 container TreeWalker object를 반환하므로 넘어 감
  // returns the first child of root, as it is the next node in document order, and so on
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

  return nodes;
}

function getFocusableEdges(container: HTMLElement) {
  const elements = getFocusableElements(container);

  const first = getFirstVisibleElement(elements, container);
  const last = getFirstVisibleElement(elements.reverse(), container);

  return [first, last] as const;
}

function focusFirst(eleements: HTMLElement[], container: HTMLElement, { select = false } = {}) {
  focus(getFirstVisibleElement(eleements, container), { select });
}

function isHidden(node: HTMLElement, upTo: HTMLElement) {
  //인자로 받은 요소의 모든 CSS 속성값을 담은 객체를 반환
  //https://developer.mozilla.org/ko/docs/Web/API/Window/getComputedStyle
  if (window.getComputedStyle(node).visibility === 'hidden') return true;

  while (node) {
    // 해당 노드는 visible이지만, container level에서 invisible일 수 있기 때문에
    // container level까지 타고 올라가면서 검사
    if (upTo !== undefined && node === upTo) return false;
    if (window.getComputedStyle(node).display === 'none') return true;
    node = node.parentElement as HTMLElement;
  }

  return false;
}

function getFirstVisibleElement(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    if (!isHidden(element, container)) return element;
  }
}

type FocusableTarget = HTMLElement | { focus(): void };

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

function focus(element?: FocusableTarget | null, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus();

    if (element !== previouslyFocusedElement && isSelectableInput(element) && select) {
      element.select();
    }
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusTrapLayerStack stack
 * -----------------------------------------------------------------------------------------------*/
type focusScope = { paused: boolean; pause(): void; resume(): void };

const focusTrapLayerStack = createFocusTrapLayerStack();

function createFocusTrapLayerStack() {
  let stack: focusScope[] = [];

  return {
    add(layer: focusScope) {
      const activeFocusScope = stack.at(-1);
      if (layer !== activeFocusScope) {
        activeFocusScope?.pause();
      }

      stack = arrayWithoutItem(stack, layer);
      stack.push(layer);
    },

    remove(layer: focusScope) {
      stack = arrayWithoutItem(stack, layer);
      stack.at(-1)?.resume();
    },
  };
}

function arrayWithoutItem<T>(array: T[], item: T) {
  let copiedArr = [...array];
  const index = copiedArr.indexOf(item);
  if (index !== -1) {
    copiedArr = copiedArr.filter((node) => node !== item);
  }

  return copiedArr;
}

const Root = FocusTrapLayer;

export {
  FocusTrapLayer,
  //
  Root,
};
export type { FocusTrapLayerProps };
