import { fireEvent, render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';

import * as React from 'react';
import { Toggle } from './toggle';

describe('Rendering Toggle', () => {
  it('Toggle 컴포넌트가 문제없이 렌더링 되어야 한다.', () => {
    // arrange
    render(<Toggle />);
    const toggle = screen.getByRole('button');

    // assertion
    expect(toggle).toBeInTheDocument();
  });

  it('Toggle 컴포넌트는 defaultPressed가 등록되어 있지 않다면 default 값은 false이다.', () => {
    render(<Toggle />);
    const toggle = screen.getByRole('button');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('defaultPressed의 값을 통해 Toggle의 초깃값을 설정할 수 있어야 한다.', () => {
    render(<Toggle defaultPressed={true} />);
    const toggle = screen.getByRole('button');

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('Render Props를 통해 렌더링 될 수 있어야 한다.', async () => {
    // arrange
    render(<Toggle>{({ pressed }) => (pressed ? 'pressed' : 'not Pressed')}</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAccessibleName('not Pressed');

    // act
    await userEvent.click(toggle);

    // assertion
    expect(toggle).toHaveAccessibleName('pressed');
  });

  describe('disabled rendering', () => {
    let rendered: RenderResult;
    let toggle: HTMLElement;
    let before: HTMLElement;
    const mockOnPressedChange = jest.fn();
    const initialState = false;
    beforeEach(() => {
      rendered = render(
        <>
          <button>Before</button>
          <Toggle disabled defaultPressed={initialState} onPressedChange={mockOnPressedChange}>
            Toggle
          </Toggle>
          ,
        </>
      );

      toggle = rendered.getByRole('button', { name: /Toggle/ });
      before = rendered.getByRole('button', { name: /Before/ });
    });

    it('disabled로 렌더링할 수 있어야 한다.', () => {
      expect(toggle).toHaveAttribute('disabled', '');
      expect(toggle).toBeDisabled();
    });

    it('disabled로 렌더링 되면, 클릭해도 onPressedChange가 실행되지 않는다.', async () => {
      await userEvent.click(toggle);

      expect(mockOnPressedChange).not.toHaveBeenCalled();
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    it('Tab을 통해 포커스되지 않아야 한다.', async () => {
      before.focus();
      expect(before).toHaveFocus();

      await userEvent.tab();

      expect(toggle).not.toHaveFocus();
    });
  });
});

describe('pressed와, pressed 관련 콜백함수가 문제없이 작동되어야 한다.', () => {
  let rendered: RenderResult;
  let toggle: HTMLElement;
  const initialState = false;
  const mockOnPressedChange = jest.fn();

  beforeEach(() => {
    mockOnPressedChange.mockClear();
    rendered = render(
      <Toggle defaultPressed={initialState} onPressedChange={mockOnPressedChange}>
        Toggle
      </Toggle>
    );
    toggle = rendered.getByRole('button');
  });

  it('click하면 toggle의 내부 상태가 토글링된다.', async () => {
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('click하면 onPressedChange가 실행되며, 바뀐 pressed를 매개변수로 가진다.', async () => {
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);

    expect(mockOnPressedChange).toHaveBeenCalledWith(true);
  });
});

describe('접근성과 키보드 이벤트에 문제가 없어야 한다.', () => {
  let rendered: RenderResult;
  let toggle: HTMLElement;
  let before: HTMLElement;
  let after: HTMLElement;
  const mockOnPressedChange = jest.fn();

  beforeEach(() => {
    mockOnPressedChange.mockClear();
    rendered = render(
      <>
        <button>Before</button>
        <Toggle onPressedChange={mockOnPressedChange}>Toggle</Toggle>
        <button>After</button>
      </>
    );
    toggle = rendered.getByRole('button', { name: /toggle/i });
    before = rendered.getByRole('button', { name: /before/i });
    after = rendered.getByRole('button', { name: /after/i });
  });

  it('접근성 위반사항이 없어야 한다.', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('Tab으로 focus할 수 있어야 한다.', async () => {
    before.focus();
    await userEvent.tab();

    expect(toggle).toHaveFocus();
  });

  it('focus되었다면, 스페이스와 엔터키로 토글을 할 수 있어야 한다.', () => {
    toggle.focus();

    fireEvent.keyDown(toggle, Keys.Space);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(toggle, Keys.Enter);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('focus되었을때, Tab을 하면 다음 tabbable 요소로 focus가 이동되어야 한다.', async () => {
    toggle.focus();

    await userEvent.tab();

    expect(toggle).not.toHaveFocus();
    expect(after).toHaveFocus();
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
