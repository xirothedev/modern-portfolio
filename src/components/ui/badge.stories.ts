import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
	title: "UI/Badge",
	component: Badge,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		children: "Badge",
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		variant: "default",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};
