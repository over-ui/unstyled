import React from 'react';
import { ComponentStory, ComponentMeta, Meta } from '@storybook/react';
import styled from 'styled-components';
import { Button } from './add';
import mdx from './add.mdx';

const StyledButton = styled.button`
  border: 0;
  background-color: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75em 1em;
  border-radius: 0.5em;
`;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  component: Button,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  // mdx 추가하는 설정
} as Meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Second = () => {
  return <div>Test</div>;
};

export const Styled = () => {
  return <StyledButton>styled button</StyledButton>;
};
