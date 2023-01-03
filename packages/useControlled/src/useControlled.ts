import * as React from 'react';

type UseControlledProps<T> = {
  value?: T;
  defaultValue?: T;
  valueOnChange?: (value: T) => void;
};

export function useControlled<T>({
  value: valueProp,
  defaultValue,
  valueOnChange,
}: UseControlledProps<T>) {
  const [internalState, setInternalState] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internalState;

  const setValue = (next: React.SetStateAction<T>) => {
    const setter = next as (prevState?: T) => T;
    const nextValue = typeof next === 'function' ? setter(value) : next;

    if (!controlled) {
      setInternalState(nextValue);
    }
    valueOnChange?.(nextValue);
  };

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
