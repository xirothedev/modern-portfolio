import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

const meta = {
	title: "UI/Separator",
	component: Separator,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		orientation: "horizontal",
		decorative: true,
	},
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => (
		<div style={{ width: 200 }}>
			<div>Above</div>
			<Separator {...args} />
			<div>Below</div>
		</div>
	),
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
		className: "h-10 mx-4",
	},
	render: (args) => (
		<div style={{ display: "flex", alignItems: "center", height: 40 }}>
			<span>Left</span>
			<Separator {...args} />
			<span>Right</span>
		</div>
	),
};

export const CustomColor: Story = {
	args: {
		className: "bg-red-500",
	},
	render: (args) => (
		<div style={{ width: 200 }}>
			<div>Above</div>
			<Separator {...args} />
			<div>Below</div>
		</div>
	),
};
