import * as React from "react";
import { Radio, RadioIndicator, RadioProps } from "./Radio";

/* -------------------------------------------------------------------------------------------------
 * RadioGroupContext
 * -----------------------------------------------------------------------------------------------*/
type RadioGroupContextValue = {
	name?: string;
	required?: boolean;
	disabled?: boolean;
	value?: string;
	loop?: boolean;
	onChange?(value: string): void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

const RadioGroupProvider = (props: RadioGroupContextValue & { children: React.ReactNode }) => {
	const { children, ...context } = props;
	const value = context;

	return <RadioGroupContext.Provider value={value}>{children}</RadioGroupContext.Provider>;
};

const useRadioGroupContext = () => {
	const context = React.useContext(RadioGroupContext);

	return context;
};

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = "RadioGroup";

type RadioGroupElement = HTMLDivElement;
type RadioGroupProps = {
	name?: RadioGroupContextValue["name"];
	required?: RadioGroupContextValue["required"];
	disabled?: RadioGroupContextValue["disabled"];
	orientation?: "vertical" | "horizontal";
	loop?: RadioGroupContextValue["loop"];
	defaultValue?: string;
	value?: RadioGroupContextValue["value"];
} & React.HTMLProps<HTMLDivElement>;

const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>((props, forwardedRef) => {
	const {
		name,
		label,
		required = false,
		disabled = false,
		orientation = "vertical",
		loop = true,
		defaultValue,
		onChange,
		children,
		...groupProps
	} = props;
	const [value, setValue] = React.useState<string | undefined>();
	const ref = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		setValue(defaultValue);
	}, []);

	return (
		<RadioGroupProvider
			name={name}
			required={required}
			disabled={disabled}
			value={value}
			loop={loop}
			onChange={setValue}
		>
			<div
				role="radiogroup"
				aria-required={required}
				aria-label={label}
				aria-orientation={orientation}
				data-disabled={disabled ? "" : undefined}
				style={orientation === "horizontal" ? { display: "flex" } : {}}
				{...groupProps}
				ref={ref}
			>
				{children}
			</div>
		</RadioGroupProvider>
	);
});

RadioGroup.displayName = RADIO_GROUP_NAME;
