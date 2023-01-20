import * as React from "react";
import { Meta } from "@storybook/react";
import styled from "@emotion/styled";
import * as RadioGroup from "./RadioGroup";
import mdx from "./RadioGroup.mdx";

export default {
	title: "over-ui/RadioGroup",
	parameters: {
		docs: {
			page: mdx,
		},
	},
} as Meta;

export const Main = () => {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<RadioGroup.Root defaultValue="stronglyAgree">
				<Flex>
					<StyledRadio value="stronglyAgree">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>Strongly Agree</Label>
				</Flex>
				<Flex>
					<StyledRadio value="agree">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>Agree</Label>
				</Flex>

				<Flex>
					<StyledRadio value="neither">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>Neither agree nor disagree</Label>
				</Flex>

				<Flex>
					<StyledRadio value="disagree">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>Disagree</Label>
				</Flex>

				<Flex>
					<StyledRadio value="stronglyDisagree">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>Strongly Disagree</Label>
				</Flex>
			</RadioGroup.Root>
		</div>
	);
};

export const Controlled = () => {
	const [value, setValue] = React.useState("red");

	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<Flex>
				<Label>What is your favorite color?</Label>
			</Flex>
			<RadioGroup.Root value={value} onValueChange={setValue} orientation="horizontal">
				<Flex>
					<StyledRadio value="red">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>red</Label>
				</Flex>
				<Flex>
					<StyledRadio value="blue">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>blue</Label>
				</Flex>

				<Flex>
					<StyledRadio value="green">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>green</Label>
				</Flex>

				<Flex>
					<StyledRadio value="yellow">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>yellow</Label>
				</Flex>

				<Flex>
					<StyledRadio value="white">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>white</Label>
				</Flex>
			</RadioGroup.Root>
		</div>
	);
};

export const Disabled = () => {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<RadioGroup.Root defaultValue="focusable1">
				<Flex>
					<StyledRadio value="focusable1">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>focusable1</Label>
				</Flex>
				<Flex>
					<StyledRadio value="focusable2">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>focusable2</Label>
				</Flex>
				<Flex>
					<StyledRadio value="disabled1" disabled>
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>disabled1</Label>
				</Flex>
				<Flex>
					<StyledRadio value="focusable3">
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>focusable3</Label>
				</Flex>
				<Flex>
					<StyledRadio value="disabled2" disabled>
						<StyledRadioGroupIndicator />
					</StyledRadio>
					<Label>disabled2</Label>
				</Flex>
			</RadioGroup.Root>
		</div>
	);
};

// TODO: Form Control 동작 안함 개선 필요
// export const WithinForm = () => {
// 	const [data, setData] = React.useState({ taste: "", price: "", atmosphere: "" });

// 	return (
// 		<div style={{ display: "flex", justifyContent: "center" }}>
// 			<form
// 				onSubmit={(event) => {
// 					event.preventDefault();
// 				}}
// 				onChange={(event) => {
// 					const radio = event.target as HTMLInputElement;
// 					setData((prevData) => ({ ...prevData, [radio.name]: radio.value }));
// 				}}
// 			>
// 				<fieldset>
// 					<legend>taste score: {data.taste}</legend>
// 					<RadioGroup.Root name="taste">
// 						<Flex>
// 							<StyledRadio value="1">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>1</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="2">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>2</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="3">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>3</Label>
// 						</Flex>
// 					</RadioGroup.Root>
// 				</fieldset>

// 				<fieldset>
// 					<legend>price score: {data.price}</legend>
// 					<RadioGroup.Root name="price">
// 						<Flex>
// 							<StyledRadio value="1">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>1</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="2">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>2</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="3">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>3</Label>
// 						</Flex>
// 					</RadioGroup.Root>
// 				</fieldset>

// 				<fieldset>
// 					<legend>atmosphere score: {data.atmosphere}</legend>
// 					<RadioGroup.Root name="atmosphere">
// 						<Flex>
// 							<StyledRadio value="1">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>1</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="2">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>2</Label>
// 						</Flex>
// 						<Flex>
// 							<StyledRadio value="3">
// 								<StyledRadioGroupIndicator />
// 							</StyledRadio>
// 							<Label>3</Label>
// 						</Flex>
// 					</RadioGroup.Root>
// 				</fieldset>

// 				<button>Submit</button>
// 			</form>
// 		</div>
// 	);
// };

const StyledRadio = styled(RadioGroup.Item)({
	all: "unset",
	backgroundColor: "white",
	width: 25,
	height: 25,
	borderRadius: "100%",
	boxShadow: "0 2px 10px black",

	"&:hover ": { backgroundColor: "wheat" },
	"&:focus": { boxShadow: "0 0 0 2px black" },
});

const StyledRadioGroupIndicator = styled(RadioGroup.Indicator)({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "100%",
	position: "relative",

	"&::after": {
		content: '""',
		display: "block",
		width: 11,
		height: 11,
		borderRadius: "50%",
		backgroundColor: "red",
	},
});

const Flex = styled.div`
	display: flex;
	align-items: center;
	margin: 10px 10px;
`;

const Label = styled.label`
	color: gray;
	font-size: 15px;
	line-height: 1;
	user-select: none;
	padding-left: 15px;
`;
