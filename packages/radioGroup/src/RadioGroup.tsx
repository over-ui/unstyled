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

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/
const ITEM_NAME = "RadioGroupItem";

type RadioGroupItemElement = HTMLButtonElement;
type RadioGroupItemProps = RadioProps & {
	value: string;
};

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>((props, forwardedRef) => {
	const { disabled, ...itemProps } = props;
	const context = useRadioGroupContext();
	const checked = context.value === itemProps.value;
	const ref = React.useRef<HTMLButtonElement | null>(null);

	const next = (ref.current?.parentNode as HTMLElement)?.nextElementSibling
		?.children as HTMLCollectionOf<HTMLButtonElement>;
	const prev = (ref.current?.parentNode as HTMLElement)?.previousElementSibling
		?.children as HTMLCollectionOf<HTMLButtonElement>;

	const findAndFocusButton = (parent: HTMLCollectionOf<HTMLElement>) => {
		for (let i = 0; i < parent.length; i++) {
			const child = parent[i] as HTMLButtonElement;
			if (child.type !== "button") continue;
			context.onChange?.(child.value);
			child.focus();
		}
	};

	const handleArrowKey = (event: React.KeyboardEvent) => {
		if (!ref) return;

		if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
			if (prev) {
				findAndFocusButton(prev);
			} else {
				if (!context.loop) return;
				const last = (ref.current?.parentNode as HTMLElement).parentNode?.lastElementChild
					?.children as HTMLCollectionOf<HTMLElement>;
				findAndFocusButton(last);
			}
		}

		if (event.key === "ArrowDown" || event.key === "ArrowRight")
			if (next) {
				findAndFocusButton(next);
			} else {
				if (!context.loop) return;
				const first = (ref.current?.parentNode as HTMLElement).parentNode?.firstElementChild
					?.children as HTMLCollectionOf<HTMLElement>;
				findAndFocusButton(first);
			}
	};

	return (
		<Radio
			disabled={disabled}
			required={context.required}
			checked={checked}
			{...itemProps}
			name={context.name}
			ref={ref}
			onCheck={() => {
				context.onChange?.(itemProps.value);
			}}
			onKeyDown={(event: React.KeyboardEvent) => {
				if (event.key === "Enter") event.preventDefault();
				handleArrowKey(event);
			}}
		/>
	);
});

RadioGroupItem.displayName = ITEM_NAME;
