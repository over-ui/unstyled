import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from '@emotion/styled';
import { Button } from './add';
import mdx from './add.mdx';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
  // mdx 추가하는 설정
} as ComponentMeta<typeof Button>;

const StyledButton = styled.button`
  width: 100px;
  height: 100px;
  background-color: red;
`;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button />;
export const Styled = () => {
  return <StyledButton>테스트 버튼</StyledButton>;
};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
