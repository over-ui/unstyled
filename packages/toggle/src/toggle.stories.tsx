import React, { useRef, useState } from 'react';
import { ComponentStory, ComponentMeta, Meta, Story } from '@storybook/react';
import styled from 'styled-components';
import { Toggle } from './toggle';
import mdx from './toggle.mdx';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'over/Toggle',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {
    docs: {
      page: mdx,
    },
  },

  // https://github.com/storybookjs/storybook/issues/11983
  argTypes: {
    defaultPressed: {
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      table: {
        defaultValue: { summary: false },
      },
    },
    as: {
      description: 'html 태그',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'button' },
      },
    },
  },

  // mdx 추가하는 설정
} as Meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// https://github.com/storybookjs/storybook/issues/11919
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const StyledToggle = styled(Toggle)`
  padding: 10px 15px;

  &[data-pressed='on'] {
    background-color: rebeccapurple;
  }
  &[data-disabled='true'] {
    background-color: red;
  }
  &:focus {
    border: 2px solid blue;
  }
  font-size: 12px;
`;

export const Main = () => {
  return <Toggle>토글</Toggle>;
};

export const As = () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <Toggle as="div" ref={divRef}>
      div Toggle
    </Toggle>
  );
};

export const Controlled = () => {
  const [state, setState] = useState(false);

  return (
    <Toggle pressed={state} onPressedChange={setState}>
      controlled : {state.toString()}
    </Toggle>
  );
};

Controlled.argTypes = {
  test: 1,
};
const useDarkMode = (pressed) => {
  // mock
  const [state, setState] = useState(pressed);
  return [state, setState];
};

export const Uncontrolled = () => {
  const [darkMode, setDarkMode] = useDarkMode(false);

  return (
    <Toggle onPressedChange={(pressed) => (pressed ? setDarkMode(true) : setDarkMode(false))}>
      토글
    </Toggle>
  );
};

export const Styled = () => {
  return (
    <>
      <StyledToggle>Styled Toggle</StyledToggle>
      <StyledToggle disabled>disabled Toggle</StyledToggle>
    </>
  );
};

// https://github.com/storybookjs/storybook/discussions/16549
