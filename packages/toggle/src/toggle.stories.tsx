import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import styled from '@emotion/styled';
import { Toggle } from './toggle';
import mdx from './toggle.mdx';

export default {
  title: 'over-ui/Toggle',
  parameters: {
    docs: {
      page: mdx,
    },
    controls: { expanded: true },
  },
} as Meta;

export const Main: Story = (args) => {
  return <Toggle {...args}>토글</Toggle>;
};

Main.argTypes = {
  disabled: {
    description: '토글을 disabled하는 프로퍼티입니다',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
    control: {
      defaultValue: false,
      type: 'boolean',
    },
  },
  as: {
    options: ['button', 'h1', 'div', 'span', 'li'],
    description: '토글을 어떤 태그로 렌더링할 지 결정합니다.',
    table: {
      type: { summary: 'HTML Element' },
      defaultValue: { summary: 'button' },
    },
    control: {
      type: 'select',
    },
  },
  onPressedChange: {
    action: 'onPressedChange',
    description: 'pressed 에 따른 콜백함수 입니다.',
    table: {
      type: { summary: '(pressed) => {}' },
    },
  },
};

export const Controlled = () => {
  const [state, setState] = useState(false);

  return (
    <Toggle pressed={state} onPressedChange={setState}>
      controlled : {state.toString()}
    </Toggle>
  );
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
    <div style={{ display: 'flex', gap: '10px' }}>
      <StyledToggle>styled Toggle</StyledToggle>
      <StyledToggle disabled>disabled Toggle</StyledToggle>
      <StyledToggle defaultPressed={true}>pressed Toggle</StyledToggle>
    </div>
  );
};

const StyledToggle = styled(Toggle)`
  padding: 10px 15px;

  &[data-pressed='on'] {
    background-color: green;
  }
  &[data-disabled='true'] {
    background-color: red;
  }
  &:focus {
    border: 2px solid blue;
  }
  border: none;
  font-size: 12px;
`;

export const RenderProps = () => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Toggle>
        {({ pressed }) => (pressed ? <span>pressed</span> : <span>not Pressed</span>)}
      </Toggle>
      <Toggle disabled>
        {({ disabled }) => (disabled ? <span>disabled</span> : <span>not disabled</span>)}
      </Toggle>
    </div>
  );
};
