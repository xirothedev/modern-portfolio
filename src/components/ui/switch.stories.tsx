import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Switch } from "./switch";

const meta = {
	title: "UI/Switch",
	component: Switch,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
	args: {
		defaultChecked: true,
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
