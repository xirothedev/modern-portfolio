import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Progress } from "./progress";

const meta = {
	title: "UI/Progress",
	component: Progress,
	tags: ["autodocs"],
	args: {
		value: 50,
	},
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomValue: Story = {
	args: {
		value: 75,
	},
};

export const Empty: Story = {
	args: {
		value: 0,
	},
};

export const Full: Story = {
	args: {
		value: 100,
	},
};
