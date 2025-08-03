import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Slider } from "./slider";

const meta = {
	title: "UI/Slider",
	component: Slider,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		className: "w-64",
	},
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue = {
	args: {
		defaultValue: [50],
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: [30],
		disabled: true,
	},
};

export const CustomRange: Story = {
	args: {
		min: 10,
		max: 90,
		step: 5,
		defaultValue: [30],
	},
};
