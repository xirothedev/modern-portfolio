import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // hoặc thay thế bằng <button>

const meta = {
	title: "UI/Collapsible",
	component: Collapsible,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
	render: () => {
		const [open, setOpen] = useState(true);

		return (
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<Button variant="outline" className="mb-2">
						{open ? "Hide content" : "Show content"}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="rounded-md border p-4">
						This is the collapsible content. You can put anything here like text, forms, or other
						components.
					</div>
				</CollapsibleContent>
			</Collapsible>
		);
	},
};
