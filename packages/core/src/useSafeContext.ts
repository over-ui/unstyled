import * as React from 'react';

export const useSafeContext = <T>(_context: React.Context<T>, scope: string) => {
  const context = React.useContext<T>(_context);

  if (!context) {
    const contextName = _context.displayName ?? _context;
    const errorMessage = `${scope} must be used wrapped with ${contextName}`;

    throw new Error(errorMessage);
  }

  return context as NonNullable<T>;
};
