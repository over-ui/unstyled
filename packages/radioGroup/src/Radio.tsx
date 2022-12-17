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
