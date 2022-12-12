import { render } from '@testing-library/react';
import React from 'react';
import { Button } from './index';

describe('button', () => {
  it('render', () => {
    render(<Button />);
    expect(1 + 2).toBe(3);
  });
});
