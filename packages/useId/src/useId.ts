import * as React from 'react';

const prefix = 'over-id-';

const randomId = () => `${prefix}${Math.random().toString(36).slice(2, 11)}`;

const useReactId: () => string | undefined =
  (React as any)['useId'.toString()] || (() => undefined);

const getReactId = () => {
  const id = useReactId();
  return id;
};

const useSafeId = () => {
  const [uniqueId, setUniqueId] = React.useState('');

  React.useEffect(() => {
    setUniqueId(randomId());
  }, []);

  return uniqueId;
};

export const useId = () => {
  return getReactId() ?? useSafeId();
};
