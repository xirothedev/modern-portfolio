import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";

const meta = {
	title: "UI/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
	args: {
		placeholder: "Type...",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: "Textarea disabled",
	},
};

export const WithValue: Story = {
	args: {
		defaultValue: "Default value in textarea",
	},
};
