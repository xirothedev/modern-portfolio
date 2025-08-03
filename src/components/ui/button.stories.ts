import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { action } from "storybook/actions";

import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "default",
		size: "default",
		onClick: action("Default click"),
		children: "Default button",
		className: "shadow-lg",
	},
};

export const Destructive: Story = {
	args: {
		...Default.args,
		variant: "destructive",
		children: "Destructive button",
	},
};

export const Outline: Story = {
	args: {
		...Default.args,
		variant: "outline",
		children: "Outline button",
	},
};

export const Secondary: Story = {
	args: {
		...Default.args,
		variant: "secondary",
		children: "Secondary button",
	},
};

export const Ghost: Story = {
	args: {
		...Default.args,
		variant: "ghost",
		children: "Ghost button",
	},
};

export const Link: Story = {
	args: {
		...Default.args,
		variant: "link",
		children: "Link button",
	},
};

export const Small: Story = {
	args: {
		...Default.args,
		size: "sm",
		children: "Small button",
	},
};

export const Large: Story = {
	args: {
		...Default.args,
		size: "lg",
		children: "Large button",
	},
};

export const Icon: Story = {
	args: {
		...Default.args,
		size: "icon",
		children: "Icon",
	},
};
