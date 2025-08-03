import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
	title: "UI/RadioGroup",
	component: RadioGroup,
	tags: ["autodocs"],
	render: (args) => (
		<RadioGroup defaultValue={args.defaultValue} {...args}>
			<div className="flex items-center space-x-2">
				<RadioGroupItem id="option-1" value="option-1" />
				<Label htmlFor="option-1">Option 1</Label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem id="option-2" value="option-2" />
				<Label htmlFor="option-2">Option 2</Label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem id="option-3" value="option-3" />
				<Label htmlFor="option-3">Option 3</Label>
			</div>
		</RadioGroup>
	),
	args: {
		defaultValue: "option-1",
	},
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreselectedOption2: Story = {
	args: {
		defaultValue: "option-2",
	},
};
