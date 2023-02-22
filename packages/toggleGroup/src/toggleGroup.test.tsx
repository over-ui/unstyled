/* eslint-disable no-console */
import { fireEvent, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import * as React from 'react';
import * as ToggleGroup from './index';

type ToggleGroupMock = Omit<React.ComponentProps<typeof ToggleGroup.Root>, 'children'>;

const ToggleGroupMock = (props: ToggleGroupMock) => {
  return (
    <ToggleGroup.Root {...props}>
      <ToggleGroup.Item value="one">one</ToggleGroup.Item>
      <ToggleGroup.Item value="two">two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">three</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

describe('single Toggle로 사용될 수 있어야 한다.', () => {
  let utils: RenderResult;
  let toggleOne: HTMLElement;
  let toggleTwo: HTMLElement;

  beforeEach(() => {
    utils = render(<ToggleGroupMock />);
    toggleOne = utils.getByRole('radio', { name: /one/ });
    toggleTwo = utils.getByRole('radio', { name: /two/ });
  });

  it('접근성 위반사항이 없어야 한다.', async () => {
    expect(await axe(utils.container)).toHaveNoViolations();
  });

  it('single Toggle Group은 radio의 접근성을 가진다.', () => {
    expect(toggleOne).toHaveAttribute('aria-checked');
    expect(toggleOne).toHaveAttribute('role', 'radio');
  });

  it('여러 요소중에 동시에 한가지 요소만을 선택할 수 있어야 한다.', async () => {
    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(toggleTwo);
    expect(toggleOne).toHaveAttribute('aria-checked', 'false');
    expect(toggleTwo).toHaveAttribute('aria-checked', 'true');
  });

  it('선택한 요소를 다시 클릭하면, pressed가 false로 바뀌어야 한다.', async () => {
    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-checked', 'false');
  });
});

describe('multiple로 사용될 수 있어야 한다.', () => {
  let utils: RenderResult;
  let toggleOne: HTMLElement;
  let toggleTwo: HTMLElement;

  beforeEach(() => {
    utils = render(<ToggleGroupMock multiple={true} />);
    toggleOne = utils.getByRole('button', { name: /one/ });
    toggleTwo = utils.getByRole('button', { name: /two/ });
  });

  it('접근성 위반사항이 없어야 한다.', async () => {
    expect(await axe(utils.container)).toHaveNoViolations();
  });

  it('single Toggle Group은 ToggleButton의 접근성을 가진다.', () => {
    expect(toggleOne).toHaveAttribute('aria-pressed');
    expect(toggleOne).toHaveAttribute('role', 'button');
  });

  it('동시에 여러 요소를 선택할 수 있어야 한다.', async () => {
    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(toggleTwo);
    expect(toggleOne).toHaveAttribute('aria-pressed', 'true');
    expect(toggleTwo).toHaveAttribute('aria-pressed', 'true');
  });

  it('선택한 요소를 다시 클릭하면, pressed가 false로 바뀌어야 한다.', async () => {
    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(toggleOne);
    expect(toggleOne).toHaveAttribute('aria-pressed', 'false');
  });
});

interface ToggleGroupFormProps extends ToggleGroupMock {
  onSubmit: (e: React.FormEvent) => void;
}

const ToggleGroupForm = (props: ToggleGroupFormProps) => {
  const { onSubmit, ...restProps } = props;
  return (
    <form onSubmit={onSubmit}>
      <ToggleGroup.Root {...restProps}>
        <ToggleGroup.Item value="one">one</ToggleGroup.Item>
        <ToggleGroup.Item value="two">two</ToggleGroup.Item>
      </ToggleGroup.Root>
      <button type="submit">submit</button>
    </form>
  );
};

describe('form control', () => {
  console.log = jest.fn();
  const onSubmit = jest.fn((e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(target));
    console.log(data);
  });

  //   https://stackoverflow.com/questions/62216232/error-not-implemented-htmlformelement-prototype-submit
  it('single Toggle로 form 이벤트를 지원할 수 있어야 한다.', async () => {
    const utils = render(<ToggleGroupForm onSubmit={onSubmit} name="form" />);
    const toggleOne = utils.getByRole('radio', { name: /one/ });
    const submitButton = utils.getByRole('button', { name: /submit/ });
    await userEvent.click(toggleOne);
    await userEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith({ form: 'one' });
  });

  it('multiple Toggle submit', async () => {
    const utils = render(<ToggleGroupForm onSubmit={onSubmit} name="form" multiple={true} />);
    const toggleOne = utils.getByRole('button', { name: /one/ });
    const toggleTwo = utils.getByRole('button', { name: /two/ });
    const submitButton = utils.getByRole('button', { name: /submit/ });

    await userEvent.click(toggleOne);
    await userEvent.click(toggleTwo);
    await userEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith({ form: 'one,two' });
  });
});

describe('roving tabindex로 포커스가 진행되어야 한다.', () => {
  let utils: RenderResult;
  let toggleOne: HTMLElement;
  let toggleTwo: HTMLElement;
  let toggleThree: HTMLElement;
  let prevEl: HTMLElement;
  let nextEl: HTMLElement;

  beforeEach(() => {
    utils = render(
      <>
        <button>prevEl</button>
        <ToggleGroupMock />
        <button>nextEl</button>
      </>
    );
    toggleOne = utils.getByRole('radio', { name: /one/ });
    toggleTwo = utils.getByRole('radio', { name: /two/ });
    toggleThree = utils.getByRole('radio', { name: /three/ });
    prevEl = utils.getByRole('button', { name: /prevEl/ });
    nextEl = utils.getByRole('button', { name: /nextEl/ });
  });

  it('이전 요소에서 Tab을 누르고, 선택된 요소가 없으면 첫번째 요소를 포커스한다.', async () => {
    prevEl.focus();
    await userEvent.tab();
    expect(toggleOne).toHaveFocus();
  });

  it("이전 요소에서 'Tab'을 누르고, 선택된 요소가 있다면 선택된 요소를 포커스한다.", async () => {
    await userEvent.click(toggleTwo);
    prevEl.focus();
    await userEvent.tab();

    expect(toggleTwo).toHaveFocus();
  });

  describe('키보드 방향키가 눌려지면,', () => {
    beforeEach(() => {
      toggleTwo.focus();
    });

    it('Arrow Right가 눌려지면 다음 요소를 포커스한다.', () => {
      fireEvent.keyDown(toggleTwo, Keys.ArrowRight);

      expect(toggleThree).toHaveFocus();
    });

    it('Arrow Left가 눌려지면 이전 요소를 포커스한다', () => {
      fireEvent.keyDown(toggleTwo, Keys.ArrowLeft);
      expect(toggleOne).toHaveFocus();
    });

    it('Arrow Down이 눌려지면, 이전 요소를 포커스한다.', () => {
      fireEvent.keyDown(toggleTwo, Keys.ArrowDown);

      expect(toggleOne).toHaveFocus();
    });

    it('Arrow Up이 눌려지면, 다음 요소를 포커스한다.', () => {
      fireEvent.keyDown(toggleTwo, Keys.ArrowUp);
      expect(toggleThree).toHaveFocus();
    });

    it('Tab키가 눌려지면, Item요소들의 다음 요소를 포커스한다.', async () => {
      await userEvent.tab();
      expect(nextEl).toHaveFocus();
    });
  });

  describe('loop로 진행되어야 한다.', () => {
    it('마지막 요소에서, 다음 요소로 진행되면 첫번째 요소를 포커스한다.', () => {
      toggleThree.focus();
      fireEvent.keyDown(toggleThree, Keys.ArrowRight);

      expect(toggleOne).toHaveFocus();
    });

    it('첫번째 요소에서, 이전 요소로 진행되면 마지막 요소를 포커스한다.', () => {
      toggleOne.focus();
      fireEvent.keyDown(toggleOne, Keys.ArrowLeft);
      expect(toggleThree).toHaveFocus();
    });
  });
});

const Keys: Record<string, Partial<KeyboardEvent>> = {
  Space: { key: ' ', keyCode: 32, charCode: 32 },
  Enter: { key: 'Enter', keyCode: 13, charCode: 13 },
  Escape: { key: 'Escape', keyCode: 27, charCode: 27 },
  Backspace: { key: 'Backspace', keyCode: 8 },

  ArrowLeft: { key: 'ArrowLeft', keyCode: 37 },
  ArrowUp: { key: 'ArrowUp', keyCode: 38 },
  ArrowRight: { key: 'ArrowRight', keyCode: 39 },
  ArrowDown: { key: 'ArrowDown', keyCode: 40 },

  Home: { key: 'Home', keyCode: 36 },
  End: { key: 'End', keyCode: 35 },

  PageUp: { key: 'PageUp', keyCode: 33 },
  PageDown: { key: 'PageDown', keyCode: 34 },

  Tab: { key: 'Tab', keyCode: 9, charCode: 9 },
};
