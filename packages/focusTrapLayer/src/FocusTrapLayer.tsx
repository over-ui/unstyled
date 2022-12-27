import * as React from 'react';
import { Poly } from '@over-ui/core';

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
//포커스 가능한 엘리먼트들을 찾는 메서드
function getFocusableElements(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  // TreeWalker를 사용해서 트리를 탐색
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
  if (getComputedStyle(node).visibility === 'hidden') return true;

  while (node) {
    // 해당 노드는 visible이지만, container level에서 invisible일 수 있기 때문에
    // container level까지 타고 올라가면서 검사
    if (upTo !== undefined && node === upTo) return false;
    if (getComputedStyle(node).display === 'none') return true;
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

// selectable이면 focus해줄 때 select도 같이 해주기 위해서
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
