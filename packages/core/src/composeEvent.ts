export const composeEvent = <E>(
  defaultEvent: (event: E) => void,
  newEvent?: (event: E) => void
) => {
  return (event: E) => {
    defaultEvent?.(event);
    newEvent?.(event);
  };
};
