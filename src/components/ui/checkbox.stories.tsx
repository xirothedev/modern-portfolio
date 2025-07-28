import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
	title: "UI/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="default" />
			<Label htmlFor="default">Accept terms and conditions</Label>
		</div>
	),
};

export const Checked: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="checked" defaultChecked />
			<Label htmlFor="checked">Checked by default</Label>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="disabled" disabled />
			<Label htmlFor="disabled" className="opacity-50">
				Disabled
			</Label>
		</div>
	),
};
