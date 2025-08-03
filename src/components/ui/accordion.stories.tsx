import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRight } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
	title: "UI/Accordion",
	component: Accordion,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		type: "single",
		collapsible: true,
	},
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
	render: (args) => (
		<Accordion {...args}>
			<AccordionItem value="item-1">
				<AccordionTrigger>Section 1</AccordionTrigger>
				<AccordionContent>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nisl nec imperdiet
					fermentum, nulla elit cursus nisl.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Section 2</AccordionTrigger>
				<AccordionContent>
					Nulla facilisi. Praesent convallis vel nisi eu pretium. Integer euismod turpis vitae eros pretium
					tincidunt.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	args: {
		type: "single",
		collapsible: true,
		className: "w-full",
		defaultValue: "item-1",
	},
};

export const SingleAccordion: Story = {
	render: (args) => (
		<Accordion {...args}>
			<AccordionItem value="item-1">
				<AccordionTrigger>Section 1</AccordionTrigger>
				<AccordionContent>Content for section 1</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Section 2</AccordionTrigger>
				<AccordionContent>Content for section 2</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	args: {
		type: "single",
		collapsible: true,
	},
};

export const MultipleAccordion: Story = {
	render: (args) => (
		<Accordion {...args}>
			<AccordionItem value="item-1">
				<AccordionTrigger>Item A</AccordionTrigger>
				<AccordionContent>Detail A</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Item B</AccordionTrigger>
				<AccordionContent>Detail B</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Item C</AccordionTrigger>
				<AccordionContent>Detail C</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	args: {
		type: "single",
		collapsible: true,
	},
};

export const LargeAccordion: Story = {
	render: (args) => (
		<Accordion {...args}>
			<AccordionItem value="item-1">
				<AccordionTrigger className="py-6 text-lg">Big Section</AccordionTrigger>
				<AccordionContent className="text-base">
					This is a large accordion with more padding and font size.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	args: {
		type: "single",
		collapsible: true,
	},
};

export const CustomIconAccordion: Story = {
	render: (args) => (
		<Accordion {...args}>
			<AccordionItem value="item-1">
				<AccordionTrigger className="flex items-center justify-between gap-2">
					Custom Icon
					<ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
				</AccordionTrigger>
				<AccordionContent>This accordion uses a different icon (ChevronRight).</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	args: {
		type: "single",
		collapsible: true,
	},
};
