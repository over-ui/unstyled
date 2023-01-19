import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import styled from '@emotion/styled';
import * as ToggleGroup from './toggleGroup';
import mdx from './toggleGroup.mdx';

export default {
  title: 'over-ui/ToggleGroup',
  parameters: {
    docs: {
      page: mdx,
    },
    controls: { expanded: true },
  },
  subcomponents: { Root: ToggleGroup.Root, Item: ToggleGroup.Item },
} as Meta;

export const Main: Story = (args) => {
  return (
    <ToggleGroup.Root>
      <ToggleGroup.Item value="value1">value1</ToggleGroup.Item>
      <ToggleGroup.Item value="value2">value2</ToggleGroup.Item>
      <ToggleGroup.Item value="value3">value3</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export const Controlled = () => {
  const [state, setState] = useState('value1');

  return (
    <ToggleGroup.Root value={state} onValueChange={setState}>
      <div>selected value: {state}</div>
      <ToggleGroup.Item value="value1">value1</ToggleGroup.Item>
      <ToggleGroup.Item value="value2">value2</ToggleGroup.Item>
      <ToggleGroup.Item value="value3">value3</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export const Uncontrolled = () => {
  // mock
  const Navigate = (value: string) => {
    return value;
  };

  return (
    <ToggleGroup.Root defaultValue="value1" onValueChange={Navigate}>
      <ToggleGroup.Item value="value1">value1</ToggleGroup.Item>
      <ToggleGroup.Item value="value2">value2</ToggleGroup.Item>
      <ToggleGroup.Item value="value3">value3</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export const Styled = () => {
  return (
    <StyledRoot defaultValue="value1">
      <StyledItem value="value1">value1</StyledItem>
      <StyledItem value="value2" disabled>
        value2
      </StyledItem>
      <StyledItem value="value3">value3</StyledItem>
    </StyledRoot>
  );
};

const StyledRoot = styled(ToggleGroup.Root)`
  display: flex;
  gap: 20px;
  height: 30px;
`;

const StyledItem = styled(ToggleGroup.Item)`
  &[data-pressed='on'] {
    background-color: green;
  }
  &[data-disabled='true'] {
    background-color: red;
  }
  border: none;
  &:focus {
    border: 2px solid blue;
  }
  padding: 5px 10px;
`;

export const RenderProps = () => {
  const items = [
    {
      value: 'value1',
      disabled: false,
    },
    {
      value: 'value2',
      disabled: false,
    },
    {
      value: 'value3',
      disabled: true,
    },
  ];
  return (
    <StyledRoot defaultValue="value1">
      {items.map((item) => (
        <StyledItem key={item.value} value={item.value} disabled={item.disabled}>
          {({ pressed, disabled }) => {
            if (disabled) return <span>disabled {item.value}</span>;
            return pressed ? <span>pressed {item.value}</span> : <span>not Pressed</span>;
          }}
        </StyledItem>
      ))}
    </StyledRoot>
  );
};

export const Multiple = () => {
  const items = [
    {
      value: 'value1',
      disabled: false,
    },
    {
      value: 'value2',
      disabled: false,
    },
    {
      value: 'value3',
      disabled: true,
    },
  ];
  const [state, setState] = useState([]);
  return (
    <StyledRoot multiple value={state} onValueChange={setState}>
      {items.map((item) => (
        <StyledItem key={item.value} value={item.value} disabled={item.disabled}>
          {item.value}
        </StyledItem>
      ))}
    </StyledRoot>
  );
};

export const FormControl = () => {
  const items = [
    {
      value: 'value1',
      disabled: false,
    },
    {
      value: 'value2',
      disabled: false,
    },
    {
      value: 'value3',
      disabled: true,
    },
  ];
  const [state, setState] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(target));
        setState(data.form as string);
      }}
    >
      <span>submit : {state}</span>
      <StyledRoot name="form">
        {items.map((item) => (
          <StyledItem key={item.value} value={item.value} disabled={item.disabled}>
            {item.value}
          </StyledItem>
        ))}
      </StyledRoot>
      <button
        style={{
          margin: '10px 0',
        }}
      >
        submit
      </button>
    </form>
  );
};

export const RovingTabIndex = () => {
  const items = [
    {
      value: 'value1',
      disabled: false,
    },
    {
      value: 'value2',
      disabled: false,
    },
    {
      value: 'value3',
      disabled: true,
    },
  ];
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button>Previous Focused</button>
      <StyledRoot>
        {items.map((item) => (
          <StyledItem key={item.value} value={item.value} disabled={item.disabled}>
            {item.value}
          </StyledItem>
        ))}
      </StyledRoot>
      <button>next Focused</button>
    </div>
  );
};
