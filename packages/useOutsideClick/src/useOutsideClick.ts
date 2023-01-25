import * as React from 'react';

export const useOutsideClick = (nodes: HTMLElement | HTMLElement[], handler: () => void) => {
  const container = React.useRef<HTMLElement[] | null>([]);

  React.useEffect(() => {
    container.current = Array.isArray(nodes) ? nodes : [nodes];
  }, [nodes]);

  const listener = React.useCallback(
    (event: MouseEvent) => {
      const eventTarget = event.target as Node;

      if (!eventTarget) return;
      if (!container.current) return;

      for (const node of container.current) {
        if (!node) return;
        if (node.contains(eventTarget)) return;
      }

      handler();
    },
    [handler]
  );

  React.useEffect(() => {
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, [nodes, listener]);
};
