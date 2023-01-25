import React from 'react';
import { Meta } from '@storybook/react';
import styled from '@emotion/styled';
import * as Select from './index';
import mdx from './select.mdx';

export default {
  title: 'over-ui/Select',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta;

export const Controlled = () => {
  const [selectedValue, setSelectedValue] = React.useState('value1');

  return (
    <Select.Root selected={selectedValue} onSelectChange={setSelectedValue}>
      <Select.Label>select favorite fruit</Select.Label>
      <Select.Trigger style={{ display: 'block' }}>{selectedValue}</Select.Trigger>
      <Select.Options>
        <Select.Option value="apple">apple</Select.Option>
        <Select.Option value="orange">orange</Select.Option>
        <Select.Option value="banana">banana</Select.Option>
      </Select.Options>
    </Select.Root>
  );
};

export const Uncontrolled = () => {
  const onSelectChange = (value: string) => {
    // do something
  };

  return (
    <Select.Root defaultSelected="orange" onSelectChange={onSelectChange}>
      <Select.Label>select favorite fruit</Select.Label>
      <Select.Trigger style={{ display: 'block' }}>
        {({ selectedValue }) => (
          <span>{selectedValue.length === 0 ? '선택하세요' : selectedValue}</span>
        )}
      </Select.Trigger>
      <Select.Options>
        <Select.Option value="apple">apple</Select.Option>
        <Select.Option value="orange">orange</Select.Option>
        <Select.Option value="banana">banana</Select.Option>
      </Select.Options>
    </Select.Root>
  );
};

export const Styled = () => {
  return (
    <StyledRoot defaultSelected="orange">
      <Select.Label>select favorite fruit</Select.Label>
      <StyledTrigger>
        {({ selectedValue }) => (
          <span>{selectedValue.length === 0 ? '선택하세요' : selectedValue}</span>
        )}
      </StyledTrigger>
      <StyledOptions>
        <StyledOption value="apple">apple</StyledOption>
        <StyledOption value="orange">orange</StyledOption>
        <StyledOption value="banana">banana</StyledOption>
        <StyledOption value="cat" disabled>
          cat
        </StyledOption>
      </StyledOptions>
    </StyledRoot>
  );
};

const StyledRoot = styled(Select.Root)`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
`;

const StyledTrigger = styled(Select.Trigger)`
  width: 100px;
  height: 30px;
  margin-top: 10px;
  background-color: #eee;
  outline: none;
  border: none;

  &:focus {
    background-color: skyblue;
  }
`;

const StyledOptions = styled(Select.Options)`
  width: 100px;
  height: 200px;
  padding: 0;
`;

const StyledOption = styled(Select.Option)`
  list-style: none;
  width: 100%;
  padding: 5px 5px;
  box-sizing: border-box;

  &:focus {
    color: rebeccapurple;
  }

  &[data-disabled='true'] {
    color: red;
  }
  &[data-selected='true'] {
    color: blue;
  }
`;

export const renderProps = () => {
  const values = [
    { value: 'apple', disabled: false },
    { value: 'orange', disabled: false },
    { value: 'banana', disabled: false },
    { value: 'cat', disabled: true },
  ];
  return (
    <StyledRoot defaultSelected="orange">
      <Select.Label>select favorite fruit</Select.Label>
      <StyledTrigger>
        {({ selectedValue, open }) => (
          <>
            <span>{selectedValue.length === 0 ? '선택하세요' : selectedValue}</span>
            <span>{open ? '⬆️' : '⬇️'}</span>
          </>
        )}
      </StyledTrigger>
      <StyledOptions>
        {values.map((item) => {
          return (
            <StyledOption key={item.value} value={item.value} disabled={item.disabled}>
              {({ disabled, selected }) => {
                if (disabled) return <span>disabled value</span>;
                return selected ? <span>selected: {item.value}</span> : <span>{item.value}</span>;
              }}
            </StyledOption>
          );
        })}
      </StyledOptions>
    </StyledRoot>
  );
};

export const Multiple = () => {
  const values = [
    { value: 'apple', disabled: false },
    { value: 'orange', disabled: false },
    { value: 'banana', disabled: false },
    { value: 'cat', disabled: true },
  ];
  return (
    <StyledRoot multiple defaultSelected={['orange']}>
      <Select.Label>uncontrolled</Select.Label>
      <StyledTrigger>
        {({ selectedValue, open }) => {
          return (
            <>
              <span>
                {selectedValue.length === 0 ? '선택하세요' : (selectedValue as string[]).join()}
              </span>
              <span>{open ? '⬆️' : '⬇️'}</span>
            </>
          );
        }}
      </StyledTrigger>
      <StyledOptions>
        {values.map((item) => {
          return (
            <StyledOption key={item.value} value={item.value} disabled={item.disabled}>
              {({ disabled, selected }) => {
                if (disabled) return <span>disabled value</span>;
                return selected ? <span>selected: {item.value}</span> : <span>{item.value}</span>;
              }}
            </StyledOption>
          );
        })}
      </StyledOptions>
    </StyledRoot>
  );
};

export const MultipleControlled = () => {
  const values = [
    { value: 'apple', disabled: false },
    { value: 'orange', disabled: false },
    { value: 'banana', disabled: false },
    { value: 'cat', disabled: true },
  ];
  const [state, setState] = React.useState([]);
  return (
    <StyledRoot multiple selected={state} onSelectChange={setState}>
      <Select.Label>controlled</Select.Label>
      <StyledTrigger>
        {({ open }) => {
          return (
            <>
              <span>{state.length === 0 ? '선택하세요' : state.join()}</span>
              <span>{open ? '⬆️' : '⬇️'}</span>
            </>
          );
        }}
      </StyledTrigger>
      <StyledOptions>
        {values.map((item) => {
          return (
            <StyledOption key={item.value} value={item.value} disabled={item.disabled}>
              {({ disabled, selected }) => {
                if (disabled) return <span>disabled value</span>;
                return selected ? <span>selected: {item.value}</span> : <span>{item.value}</span>;
              }}
            </StyledOption>
          );
        })}
      </StyledOptions>
    </StyledRoot>
  );
};

export const FormControl = () => {
  const values = [
    { value: 'apple', disabled: false },
    { value: 'orange', disabled: false },
    { value: 'banana', disabled: false },
    { value: 'cat', disabled: true },
  ];
  const [state, setState] = React.useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(target));
        setState(data.selected as string);
      }}
    >
      <span>form state:{state}</span>
      <StyledRoot defaultSelected="orange" name="selected">
        <Select.Label>select favorite fruit</Select.Label>
        <StyledTrigger>
          {({ selectedValue, open }) => (
            <>
              <span>{selectedValue.length === 0 ? '선택하세요' : selectedValue}</span>
              <span>{open ? '⬆️' : '⬇️'}</span>
            </>
          )}
        </StyledTrigger>
        <StyledOptions>
          {values.map((item) => {
            return (
              <StyledOption key={item.value} value={item.value} disabled={item.disabled}>
                {({ disabled, selected }) => {
                  if (disabled) return <span>disabled value</span>;
                  return selected ? <span>selected: {item.value}</span> : <span>{item.value}</span>;
                }}
              </StyledOption>
            );
          })}
        </StyledOptions>
      </StyledRoot>
      <button>submit</button>
    </form>
  );
};

export const KeyboardSupport = () => {
  const values = [
    { value: 'apple', disabled: false },
    { value: 'orange', disabled: false },
    { value: 'banana', disabled: false },
    { value: 'cat', disabled: true },
  ];
  return (
    <StyledRoot defaultSelected="orange" orientation="horizontal">
      <span>horizontal keyboard support</span>
      <Select.Label>select favorite fruit</Select.Label>
      <StyledTrigger>
        {({ selectedValue, open }) => (
          <>
            <span>{selectedValue.length === 0 ? '선택하세요' : selectedValue}</span>
            <span>{open ? '⬆️' : '⬇️'}</span>
          </>
        )}
      </StyledTrigger>
      <StyledOptions style={{ display: 'flex', height: '60px' }}>
        {values.map((item) => {
          return (
            <StyledOption key={item.value} value={item.value} disabled={item.disabled}>
              {({ disabled, selected }) => {
                if (disabled) return <span>disabled value</span>;
                return selected ? <span>selected: {item.value}</span> : <span>{item.value}</span>;
              }}
            </StyledOption>
          );
        })}
      </StyledOptions>
    </StyledRoot>
  );
};
