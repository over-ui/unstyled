/* eslint-disable react/display-name */
import * as React from 'react';
import { Poly, composeEvent, useSafeContext } from '@over-ui/core';

/* -------------------------------------------------------------------------------------------------
 * RadioContext
 * -----------------------------------------------------------------------------------------------*/
type RadioContextValue = { checked?: boolean; disabled?: boolean };

const RadioContext = React.createContext<RadioContextValue>({});

const RadioProvider = (props: RadioContextValue & { children: React.ReactNode }) => {
  const { children, ...context } = props;
  const value = context;

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
};

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/
type RadioProps = Poly.Props<typeof RADIO_TAG> & {
  checked?: boolean;
  required?: boolean;
  onCheck?(): void;
};

const RADIO_TAG = 'button';
const RADIO_DISPLAY_NAME = 'Radio';

const Radio: Poly.Component<typeof RADIO_TAG, RadioProps> = React.forwardRef(
  <T extends React.ElementType = typeof RADIO_TAG>(
    props: Poly.Props<T, RadioProps>,
    forwardedRef: Poly.Ref<T>
  ) => {
    const {
      as,
      children,
      checked = false,
      disabled,
      required,
      value = 'on',
      onCheck,
      ...radioProps
    } = props;
    const Tag = as || RADIO_TAG;

    const handleOnClick = () => {
      if (!checked) onCheck?.();
    };

    return (
      <RadioProvider checked={checked} disabled={disabled}>
        <Tag
          type="button"
          role="radio"
          aria-checked={checked}
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          tabIndex={checked ? 0 : -1}
          ref={forwardedRef}
          onClick={composeEvent(handleOnClick, props.onClick)}
          {...radioProps}
        >
          {children}
        </Tag>
        <ImplicitInput
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          style={{
            transform: 'translateX(-100%)',
          }}
        />
      </RadioProvider>
    );
  }
);

Radio.displayName = RADIO_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/
type RadioIndicatorProps = Poly.Props<typeof RADIO_INDICATOR_TAG>;

const RADIO_INDICATOR_TAG = 'span';
const RADIO_INDICATOR_DISPLAY_NAME = 'RadioIndicator';

const RadioIndicator: Poly.Component<typeof RADIO_INDICATOR_TAG, RadioIndicatorProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof RADIO_INDICATOR_TAG>(
      props: Poly.Props<T, RadioIndicatorProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, ...radioIndicatorProps } = props;
      const Tag = as || RADIO_INDICATOR_TAG;
      const context = useSafeContext(RadioContext, 'Radio.Indicator');

      return (
        <>
          {context.checked && (
            <Tag
              data-state="checked"
              data-disabled={context.disabled ? '' : undefined}
              {...radioIndicatorProps}
              ref={forwardedRef}
            />
          )}
        </>
      );
    }
  );

RadioIndicator.displayName = RADIO_INDICATOR_DISPLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * ImplicitInput
 * -----------------------------------------------------------------------------------------------*/
type InputProps = Poly.Props<typeof IMPLICIT_INPUT_TAG>;
type ImplicitInputProps = Omit<InputProps, 'checked'> & {
  checked?: boolean;
};

const IMPLICIT_INPUT_TAG = 'input';

const ImplicitInput: Poly.Component<typeof IMPLICIT_INPUT_TAG, ImplicitInputProps> =
  React.forwardRef(
    <T extends React.ElementType = typeof IMPLICIT_INPUT_TAG>(
      props: Poly.Props<T, ImplicitInputProps>,
      forwardedRef: Poly.Ref<T>
    ) => {
      const { as, checked, ...inputProps } = props;
      const Tag = as || IMPLICIT_INPUT_TAG;
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <Tag
          type="radio"
          aria-hidden
          defaultChecked={checked}
          {...inputProps}
          tabIndex={-1}
          ref={ref}
          style={{
            ...props.style,
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          }}
        />
      );
    }
  );

export {
  //
  Radio,
  RadioIndicator,
};
export type { RadioProps };
