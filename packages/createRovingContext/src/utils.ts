const TAB_INDEX = {
  FOCUSABLE: 0,
  UN_FOCUSABLE: -1,
};

const FIRST_INDEX = 0;

const getCurrentFocused = (items: HTMLElement[]) => {
  return items.findIndex((item) => item === document.activeElement);
};
const getComputedIndex = (curIndex: number, length: number) => {
  return [
    curIndex + 1 >= length ? FIRST_INDEX : curIndex + 1,
    curIndex - 1 < 0 ? length - 1 : curIndex - 1,
  ];
};
const setNodeFocusable = (node: HTMLElement) => {
  node.tabIndex = TAB_INDEX.FOCUSABLE;
};
const setNodeUnFocusable = (node: HTMLElement) => {
  node.tabIndex = TAB_INDEX.UN_FOCUSABLE;
};

const setNodeFocus = (node: HTMLElement) => {
  node.focus();
};

export { getCurrentFocused, getComputedIndex, setNodeFocusable, setNodeUnFocusable, setNodeFocus };
