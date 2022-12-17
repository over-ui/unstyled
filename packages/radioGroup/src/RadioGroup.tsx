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
