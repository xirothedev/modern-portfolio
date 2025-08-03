import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";

const meta = {
	title: "UI/Input",
	component: Input,
	tags: ["autodocs"],
	args: {
		placeholder: "Enter your name",
		type: "text",
	},
} satisfies Meta<typeof Input>;

export default meta;

export const Default: StoryObj<typeof Input> = {};
export const Password: StoryObj<typeof Input> = {
	args: {
		type: "password",
		placeholder: "••••••••",
	},
};
