import * as React from 'react';
import { Radio, RadioIndicator, RadioProps } from './Radio';
import { Poly, composeEvent, useSafeContext } from '@over-ui/core';
import { useControlled } from '@over-ui/use-controlled';
import { mergeRefs } from '@over-ui/merge-refs';

/* -------------------------------------------------------------------------------------------------
 * RadioGroupContext
 * -----------------------------------------------------------------------------------------------*/
type RadioGroupContextValue = {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  loop?: boolean;
  value?: string;
  onValueChange?(value: string): void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

const RadioGroupProvider = (props: RadioGroupContextValue & { children: React.ReactNode }) => {
  const { children, ...context } = props;
  const value = context;

  return <RadioGroupContext.Provider value={value}>{children}</RadioGroupContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
type RadioGroupProps = Poly.Props<typeof RADIO_GROUP_TAG> & {
  name?: RadioGroupContextValue['name'];
  required?: RadioGroupContextValue['required'];
  disabled?: RadioGroupContextValue['disabled'];
  loop?: RadioGroupContextValue['loop'];
  orientation?: 'vertical' | 'horizontal';
  defaultValue?: string;
  value?: RadioGroupContextValue['value'];
  onValueChange?: RadioGroupContextValue['onValueChange'];
};

const RADIO_GROUP_TAG = 'div';
const RADIO_GROUP_DISPLAY_NAME = 'RadioGroup';

const RadioGroup: Poly.Component<typeof RADIO_GROUP_TAG, RadioGroupProps> = React.forwardRef(
  <T extends React.ElementType = typeof RADIO_GROUP_TAG>(
    props: Poly.Props<T, RadioGroupProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const {
      as,
      name,
      label,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation = 'vertical',
      loop = true,
      onValueChange,
      children,
      ...groupProps
    } = props;

    const [value, setValue] = useControlled({
      value: valueProp,
      defaultValue: defaultValue,
      valueOnChange: onValueChange,
    });
    const Tag = as || RADIO_GROUP_TAG;

    return (
      <RadioGroupProvider
        name={name}
        required={required}
        disabled={disabled}
        loop={loop}
        value={value}
        onValueChange={setValue}
      >
        <Tag
          role="radiogroup"
          aria-required={required}
          aria-label={label}
          aria-orientation={orientation}
          data-disabled={disabled ? '' : undefined}
          style={
            orientation === 'horizontal'
              ? { display: 'flex' }
              : { display: 'flex', flexDirection: 'column' }
          }
          {...groupProps}
          ref={forwardedRef}
        >
          {children}
        </Tag>
      </RadioGroupProvider>
    );
  }
);

RadioGroup.displayName = RADIO_GROUP_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/
type RadioGroupItemProps = Omit<RadioProps, 'onCheck' | 'name'> & {
  value: string;
};

const RADIO_GROUP_ITEM_TAG = 'button';
const RADIO_GROUP_ITEM_DISPLAY_NAME = 'RadioGroupItem';

const RadioGroupItem: Poly.Component<typeof RADIO_GROUP_ITEM_TAG, RadioGroupItemProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof RADIO_GROUP_ITEM_TAG>(
      props: Poly.Props<T, RadioGroupItemProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { disabled, ...itemProps } = props;
      const context = useSafeContext(RadioGroupContext, 'RadioGroup.Item');
      const checked = context.value === itemProps.value;
      const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
      const mergedRef = mergeRefs([(node: HTMLButtonElement) => setButton(node), forwardedRef]);

      const [next, prev] = getNextAndPrevRadio(button);

      const handleArrowKey = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          if (prev) {
            findAndFocusButton(prev, context, 'prev');
          } else {
            if (!context.loop) return;
            const last = (button?.parentNode as HTMLElement).parentNode?.lastElementChild
              ?.children as HTMLCollectionOf<HTMLElement>;
            findAndFocusButton(last, context, 'prev');
          }
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          if (next) {
            findAndFocusButton(next, context, 'next');
          } else {
            if (!context.loop) return;
            const first = (button?.parentNode as HTMLElement).parentNode?.firstElementChild
              ?.children as HTMLCollectionOf<HTMLElement>;
            findAndFocusButton(first, context, 'next');
          }
        }
      };

      //버튼의 형제 노드(ex: label)를 클릭했을 때 해당 버튼이 포커스 되도록 해줍니다.
      const handlePointerDown = (event: PointerEvent) => {
        if (disabled) return;
        if ((event.target as HTMLElement).parentElement === button?.parentElement) {
          context.onValueChange?.(button?.value);
        }
      };

      const handlePointerUp = (event: PointerEvent) => {
        if (disabled) return;
        if ((event.target as HTMLElement).parentElement === button?.parentElement) {
          button?.focus();
        }
      };

      React.useEffect(() => {
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
          document.removeEventListener('pointerdown', handlePointerDown);
          document.removeEventListener('pointerup', handlePointerUp);
        };
      }, [button]);

      return (
        <Radio
          disabled={disabled}
          required={context.required}
          checked={checked}
          {...itemProps}
          name={context.name}
          ref={mergedRef}
          onCheck={() => {
            context.onValueChange?.(itemProps.value);
          }}
          onKeyDown={composeEvent(handleArrowKey, itemProps.onKeyDown)}
        />
      );
    }
  );

RadioGroupItem.displayName = RADIO_GROUP_ITEM_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupIndicator
 * -----------------------------------------------------------------------------------------------*/
type RadioGroupIndicatorProps = Poly.Props<typeof RADIO_GROUP_INDICATOR_TAG>;

const RADIO_GROUP_INDICATOR_TAG = 'span';
const RADIO_GROUP_INDICATOR_DISPLAY_NAME = 'RadioGroupIndicator';

const RadioGroupIndicator: Poly.Component<
  typeof RADIO_GROUP_INDICATOR_TAG,
  RadioGroupIndicatorProps
> = React.forwardRef(
  <T extends React.ElementType = typeof RADIO_GROUP_INDICATOR_TAG>(
    props: Poly.Props<T, RadioGroupIndicatorProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    return <RadioIndicator {...props} ref={forwardedRef} />;
  }
);

RadioGroupIndicator.displayName = RADIO_GROUP_INDICATOR_DISPLAY_NAME;

//

//button이 아닌 button을 감싸고 있는 부모 div를 찾아냅니다.
function getNextAndPrevRadio(ref: HTMLButtonElement | null) {
  const next = ref?.parentElement?.nextElementSibling
    ?.children as HTMLCollectionOf<HTMLButtonElement>;
  const prev = ref?.parentElement?.previousElementSibling
    ?.children as HTMLCollectionOf<HTMLButtonElement>;

  return [next, prev];
}

//찾아낸 부모 div에서 자식인 button을 찾아 포커스 해 줍니다.
function findAndFocusButton(
  parent: HTMLCollectionOf<HTMLElement>,
  context: RadioGroupContextValue,
  dir: 'prev' | 'next'
) {
  for (let i = 0; i < parent.length; i++) {
    const child = parent[i] as HTMLButtonElement;
    if (child.type !== 'button') continue;
    //다음(이전) 라디오가 disable일 경우 그 다음(이전)으로 라디오를 재귀적으로 탐색합니다.
    if (child.disabled) {
      const [next, prev] = getNextAndPrevRadio(child);
      if (dir === 'next') {
        if (next) {
          findAndFocusButton(next, context, 'next');
        } else {
          if (!context.loop) return;
          const first = (child.parentNode as HTMLElement).parentNode?.firstElementChild
            ?.children as HTMLCollectionOf<HTMLElement>;
          findAndFocusButton(first, context, 'next');
        }
      }
      if (dir === 'prev') {
        if (prev) {
          findAndFocusButton(prev, context, 'prev');
        } else {
          if (!context.loop) return;
          const last = (child.parentNode as HTMLElement).parentNode?.lastElementChild
            ?.children as HTMLCollectionOf<HTMLElement>;
          findAndFocusButton(last, context, 'prev');
        }
      }
      break;
    }
    context.onValueChange?.(child.value);
    child.focus();
    break;
  }
}

//

const Root = RadioGroup;
const Item = RadioGroupItem;
const Indicator = RadioGroupIndicator;

export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
  //
  Root,
  Item,
  Indicator,
};
export type { RadioGroupProps, RadioGroupItemProps, RadioGroupIndicatorProps };
