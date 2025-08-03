import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
	title: "UI/Popover",
	component: Popover,
	tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex h-screen items-center justify-center">
			<Popover>
				<PopoverTrigger asChild>
					<Button>Open Popover</Button>
				</PopoverTrigger>
				<PopoverContent className={cn("text-sm")}>This is a simple popover content.</PopoverContent>
			</Popover>
		</div>
	),
};
