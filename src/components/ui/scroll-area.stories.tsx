import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "./scroll-area";

const meta = {
	title: "UI/ScrollArea",
	component: ScrollArea,
	tags: ["autodocs"],
	render: (args) => (
		<div className="h-60 w-80 border">
			<ScrollArea {...args}>
				<div className="space-y-2 p-4">
					{Array.from({ length: 30 }, (_, i) => (
						<p key={i} className="text-sm">
							Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</p>
					))}
				</div>
			</ScrollArea>
		</div>
	),
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
