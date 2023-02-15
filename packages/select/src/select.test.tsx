import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RootProps } from './select';
import * as Select from './select';

const renderSelect = <T extends string | string[]>(props?: RootProps<T>) => {
  const onSelectChange = jest.fn();
  const utils = render(
    <Select.Root
      multiple={props?.multiple}
      defaultSelected={props?.defaultSelected}
      defaultOpen={props?.defaultOpen}
      onSelectChange={onSelectChange}
    >
      <Select.Label>Select Label</Select.Label>
      <Select.Trigger>Trigger Button</Select.Trigger>
      <Select.Options>
        <Select.Option value="one">one</Select.Option>
        <Select.Option value="two">two</Select.Option>
        <Select.Option value="disabled" disabled>
          disabled
        </Select.Option>
        <Select.Option value="three">three</Select.Option>
      </Select.Options>
    </Select.Root>
  );

  const Trigger = () => utils.getByRole('combobox');
  const OptionList = () => utils.getAllByRole('option');
  const Options = () => utils.getByRole('listbox');
  const Label = () => utils.getByText(/select label/i);

  const clickTrigger = async () => await userEvent.click(Trigger());
  const expectSelectedTrue = (El: HTMLElement) =>
    expect(El).toHaveAttribute('aria-selected', 'true');
  const expectSelectedFalse = (El: HTMLElement) =>
    expect(El).toHaveAttribute('aria-selected', 'false');

  return {
    utils,
    Trigger,
    OptionList,
    Options,
    Label,
    clickTrigger,
    expectSelectedTrue,
    expectSelectedFalse,
    onSelectChange,
  };
};

describe('rendering', () => {
  it('문제없이 렌더링되어야 한다.', () => {
    const { Trigger } = renderSelect();

    expect(Trigger()).toBeInTheDocument();
  });

  it('Trigger를 클릭하면, Options는 보여져야 한다.', async () => {
    const { Trigger, Options, OptionList, clickTrigger } = renderSelect();

    await clickTrigger();

    expect(Trigger()).toBeInTheDocument();
    expect(Options()).toBeInTheDocument();
    expect(OptionList()).toHaveLength(4);
  });

  it('defaultOpen을 통해 초기에 options의 열려진 상태를 제어할 수 있어야 한다.', () => {
    const { Options, OptionList } = renderSelect({
      defaultOpen: true,
    });

    expect(Options()).toBeInTheDocument();
    expect(OptionList()).toHaveLength(4);
  });

  it('defaultSelected를 통해 초기 선택값을 제어할 수 있어야 한다.', async () => {
    const { OptionList, clickTrigger, expectSelectedTrue } = renderSelect({
      defaultSelected: 'one',
    });

    await clickTrigger();
    const [optionOne] = OptionList();

    expectSelectedTrue(optionOne);
  });
});

describe('single Select로 사용할 수 있어야 한다.', () => {
  it('single select로 옵션을 선택하면 options는 닫히게 된다.', async () => {
    const { Options, OptionList, clickTrigger } = renderSelect();

    await clickTrigger();
    const [OptionOne] = OptionList();
    const OptionsBox = Options();
    await userEvent.click(OptionOne);

    expect(OptionsBox).not.toBeInTheDocument();
  });

  it('single select는 한번에 하나의 옵션만 선택할 수 있다.', async () => {
    const { OptionList, clickTrigger, expectSelectedTrue, expectSelectedFalse } = renderSelect();

    await clickTrigger();

    const [beforeOne] = OptionList();

    await userEvent.click(beforeOne);
    // 옵션을 선택해서 돔에서 사라지게 됨

    await clickTrigger();

    const [midOne, midTwo] = OptionList();
    expectSelectedTrue(midOne);
    expectSelectedFalse(midTwo);

    await userEvent.click(midTwo);

    await clickTrigger();
    const [afterOne, afterTwo] = OptionList();

    expectSelectedTrue(afterTwo);
    expectSelectedFalse(afterOne);
  });

  it('선택한 요소를 다시 클릭하면, selected가 취소되어야 한다.', async () => {
    const { OptionList, clickTrigger, expectSelectedTrue, expectSelectedFalse } = renderSelect();

    await clickTrigger();

    await userEvent.click(OptionList()[0]);
    // 첫번째 리스트 선택

    await clickTrigger();

    expectSelectedTrue(OptionList()[0]);

    await userEvent.click(OptionList()[0]);

    await clickTrigger();

    expectSelectedFalse(OptionList()[0]);
  });

  it('옵션을 선택할 때마다, 선택된 value를 매개변수로 가지는 onSelectChange함수가 호출되어야 한다.', async () => {
    const { OptionList, clickTrigger, onSelectChange } = renderSelect();

    await clickTrigger();

    await userEvent.click(OptionList()[0]);
    // OptionList[0]은 "one" 을 value로 가짐

    expect(onSelectChange).toHaveBeenCalledWith('one');
  });
});

describe('Label과 함께 사용할 수 있어야 한다.', () => {
  it('Label 태그가 렌더링 되어야 한다.', () => {
    const { Label } = renderSelect();
    expect(Label()).toBeInTheDocument();
  });

  it('Label의 id가 Trigger의 aria-labelledby에 연결되어야 한다.', () => {
    const { Trigger, Label } = renderSelect();
    const LabelId = Label().id;
    expect(Trigger()).toHaveAttribute('aria-labelledby', LabelId);
  });
});

describe('multi Select로 사용할 수 있어야 한다.', () => {
  it('multi select로 옵션을 선택하면 options는 닫히지 않는다.', async () => {
    const { Options, OptionList, clickTrigger } = renderSelect({
      multiple: true,
    });

    await clickTrigger();
    await userEvent.click(OptionList()[0]);

    expect(Options()).toBeInTheDocument();
    expect(OptionList()).toHaveLength(4);
  });

  it('multi select는 동시에 여러개의 옵션을 선택할 수 있어야 한다.', async () => {
    const { OptionList, clickTrigger, expectSelectedTrue, expectSelectedFalse, onSelectChange } =
      renderSelect({ multiple: true });

    await clickTrigger();
    const [OptionOne, OptionTwo] = OptionList();

    await userEvent.click(OptionOne);

    expectSelectedTrue(OptionOne);
    expectSelectedFalse(OptionTwo);

    await userEvent.click(OptionTwo);

    expectSelectedTrue(OptionOne);
    expectSelectedTrue(OptionTwo);
  });

  it('선택한 요소를 다시 클릭하면, selected가 취소되어야 한다.', async () => {
    const { OptionList, clickTrigger, expectSelectedTrue, expectSelectedFalse } = renderSelect({
      multiple: true,
    });

    await clickTrigger();

    const [OptionOne] = OptionList();

    await userEvent.click(OptionOne);

    expectSelectedTrue(OptionOne);

    await userEvent.click(OptionOne);

    expectSelectedFalse(OptionOne);
  });

  it('multi select로 옵션을 선택할 때마다, 선택된 value를 매개변수로 가지는 onSelectChange함수가 호출되어야 한다.', async () => {
    const { OptionList, clickTrigger, onSelectChange } = renderSelect({
      multiple: true,
    });
    await clickTrigger();

    const [OptionOne, OptionTwo] = OptionList();
    await userEvent.click(OptionOne);
    expect(onSelectChange).toHaveBeenCalledWith(['one']);

    await userEvent.click(OptionTwo);
    expect(onSelectChange).toHaveBeenCalledWith(['one', 'two']);
  });
});

const renderSelectWithForm = <T extends string | string[]>(props?: RootProps<T>) => {
  const handleSubmit = jest.fn();
  const onSelectChange = jest.fn();
  const utils = render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(Object.fromEntries(new FormData(e.target as HTMLFormElement)));
      }}
    >
      <Select.Root
        multiple={props?.multiple}
        defaultSelected={props?.defaultSelected}
        defaultOpen={props?.defaultOpen}
        onSelectChange={onSelectChange}
        name={props?.name}
      >
        <Select.Label>Select Label</Select.Label>
        <Select.Trigger>Trigger Button</Select.Trigger>
        <Select.Options>
          <Select.Option value="one">one</Select.Option>
          <Select.Option value="two">two</Select.Option>
          <Select.Option value="disabled">disabled</Select.Option>
          <Select.Option value="three">three</Select.Option>
        </Select.Options>
      </Select.Root>
      <button type="submit">submit</button>
    </form>
  );

  const Trigger = () => utils.getByRole('combobox');
  const OptionList = () => utils.getAllByRole('option');
  const Submit = () => utils.getByRole('button', { name: /submit/ });
  const clickTrigger = async () => await userEvent.click(Trigger());

  return {
    utils,
    Trigger,
    OptionList,
    Submit,
    clickTrigger,
    handleSubmit,
  };
};

describe('form control 할 수 있어야 한다.', () => {
  it('single select에서 form control이 가능해야 한다.', async () => {
    const { OptionList, clickTrigger, handleSubmit, Submit } = renderSelectWithForm({
      multiple: true,
      name: 'form',
    });

    await clickTrigger();
    const [OptionOne] = OptionList();
    const SubmitBtn = Submit();
    await userEvent.click(OptionOne);
    await userEvent.click(SubmitBtn);
    expect(handleSubmit).toHaveBeenCalledWith({ form: 'one' });
  });

  it('multi select에서 form control이 가능해야 한다.', async () => {
    const { OptionList, clickTrigger, handleSubmit, Submit } = renderSelectWithForm({
      multiple: true,
      name: 'form',
    });

    await clickTrigger();
    const [OptionOne] = OptionList();
    const SubmitBtn = Submit();
    await userEvent.click(OptionOne);
    await userEvent.click(SubmitBtn);
    expect(handleSubmit).toHaveBeenCalledWith({ form: 'one' });

    handleSubmit.mockClear();
    await clickTrigger();
    const [_, afterTwo] = OptionList();
    await userEvent.click(afterTwo);
    // OptionOne은 다시 누르지 않았으므로, true 상태
    await userEvent.click(SubmitBtn);
    expect(handleSubmit).toHaveBeenCalledWith({ form: 'one,two' });
  });
});

describe('키보드 인터렉션과 포커스를 지원해야 한다.', () => {
  describe('Trigger에서 키보드 인터렉션이 가능해야 한다.', () => {
    it('Trigger에 Focus되었다면, Space와 Enter, ArrowDown으로 Options를 열 수 있어야 한다.', async () => {
      const { Trigger, Options, clickTrigger } = renderSelect();

      const trigger = Trigger();
      trigger.focus();

      fireEvent.keyDown(trigger, Keys.Enter);

      expect(Options()).toBeInTheDocument();

      await clickTrigger();

      fireEvent.keyDown(trigger, Keys.Space);

      expect(Options()).toBeInTheDocument();

      await clickTrigger();

      fireEvent.keyDown(trigger, Keys.ArrowDown);

      expect(Options()).toBeInTheDocument();
    });
  });
  describe('Options를 키보드를 통해 탐색할 수 있어야 하며 disabled는 무시해야 한다.', () => {
    it('ArrowDown과 ArrowUp키를 이용해 이전 요소를 포커스할 수 있어야 한다.', () => {
      const { Options, OptionList } = renderSelect({ defaultOpen: true });
      // defaultOpen에 관한 테스트를 진행했고, 중복 코드를 피하기 위해 열린채로 진행.
      const OptionsBox = Options();
      const [OptionOne, OptionTwo, disabled, OptionThree] = OptionList();
      fireEvent.keyDown(OptionsBox, Keys.ArrowDown);

      expect(OptionTwo).toHaveFocus();

      fireEvent.keyDown(OptionsBox, Keys.ArrowDown);
      expect(disabled).not.toHaveFocus();
      expect(OptionThree).toHaveFocus();

      fireEvent.keyDown(OptionsBox, Keys.ArrowUp);
      expect(OptionTwo).toHaveFocus();
      fireEvent.keyDown(OptionsBox, Keys.ArrowUp);
      expect(OptionOne).toHaveFocus();
    });

    it('Home키는 첫번째 요소를, End 키는 마지막 요소를 포커스 한다.', () => {
      const { Options, OptionList } = renderSelect({ defaultOpen: true });

      const OptionsBox = Options();
      const [OptionOne, OptionTwo, disabled, OptionThree] = OptionList();
      fireEvent.keyDown(OptionsBox, Keys.ArrowDown);
      expect(OptionTwo).toHaveFocus();

      fireEvent.keyDown(OptionsBox, Keys.Home);
      expect(OptionOne).toHaveFocus();

      fireEvent.keyDown(OptionsBox, Keys.End);
      expect(OptionThree).toHaveFocus();
    });

    it('Space와 Enter키로 해당 옵션을 토글할 수 있어야 한다.', async () => {
      const { OptionList, clickTrigger, expectSelectedTrue, expectSelectedFalse } = renderSelect({
        defaultOpen: true,
      });

      fireEvent.keyDown(OptionList()[0], Keys.Enter);

      await clickTrigger();

      expectSelectedTrue(OptionList()[0]);

      fireEvent.keyDown(OptionList()[0], Keys.Space);

      await clickTrigger();

      expectSelectedFalse(OptionList()[0]);
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
