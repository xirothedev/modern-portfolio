import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "@/components/ui/label";

const meta = {
	title: "UI/Label",
	component: Label,
	tags: ["autodocs"],
	args: {
		children: "Username",
		htmlFor: "username",
	},
} satisfies Meta<typeof Label>;

export default meta;

export const Default: StoryObj<typeof Label> = {};
