import * as React from "react";

/* -------------------------------------------------------------------------------------------------
 * RadioContext
 * -----------------------------------------------------------------------------------------------*/
type RadioContextValue = { checked?: boolean; disabled?: boolean };

const RADIO_NAME = "Radio";

const RadioContext = React.createContext<RadioContextValue>({});

const RadioProvider = (props: RadioContextValue & { children: React.ReactNode }) => {
	const { children, ...context } = props;
	const value = context;

	return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
};

const useRadioContext = () => {
	const context = React.useContext(RadioContext);

	return context;
};

/* -------------------------------------------------------------------------------------------------
 * Radio
 * -----------------------------------------------------------------------------------------------*/
type RadioElement = HTMLButtonElement;
type RadioProps = {
	checked?: boolean;
	required?: boolean;
	onCheck?(): void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Radio = React.forwardRef<RadioElement, RadioProps>((props, forwardedRef) => {
	const { children, checked = true, disabled, required, value = "on", onCheck, ...radioProps } = props;

	return (
		<RadioProvider checked={checked} disabled={disabled}>
			<button
				type="button"
				role="radio"
				aria-checked={checked}
				disabled={disabled}
				dats-state={getState(checked)}
				value={value}
				tabIndex={checked ? 0 : -1}
				ref={forwardedRef}
				onClick={() => {
					if (!checked) onCheck?.();
				}}
				{...radioProps}
			>
				{children}
			</button>
			<ImplicitInput
				value={value}
				checked={checked}
				disabled={disabled}
				style={{
					transform: "translateX(-100%)",
				}}
			/>
		</RadioProvider>
	);
});

Radio.displayName = RADIO_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioIndicator
 * -----------------------------------------------------------------------------------------------*/
const INDICATOR_NAME = "RadioIndicator";

type RadioIndicatorElement = HTMLSpanElement;
type RadioIndicatorProps = React.HTMLProps<HTMLSpanElement>;

const RadioIndicator = React.forwardRef<RadioIndicatorElement, RadioIndicatorProps>((props, forwardedRef) => {
	const context = useRadioContext();

	return (
		<>
			{context.checked && (
				<span
					data-state={getState(context.checked)}
					data-disabled={context.disabled ? "" : undefined}
					{...props}
					ref={forwardedRef}
				/>
			)}
		</>
	);
});

RadioIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ImplicitInput
 * -----------------------------------------------------------------------------------------------*/
type ImplicitInputProps = {
	checked: boolean;
	disabled?: boolean;
} & React.HTMLProps<HTMLInputElement>;

const ImplicitInput = (props: ImplicitInputProps) => {
	const { checked, ...inputProps } = props;

	return (
		<input
			type="radio"
			aria-hidden
			defaultChecked={checked}
			{...inputProps}
			tabIndex={-1}
			style={{
				...props.style,
				position: "absolute",
				pointerEvents: "none",
				opacity: 0,
				margin: 0,
			}}
		/>
	);
};

function getState(checked: Boolean) {
	return checked ? "checked" : "unchecked";
}

export { Radio, RadioIndicator };
export type { RadioProps };
