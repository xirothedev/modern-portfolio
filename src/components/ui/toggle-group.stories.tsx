import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	List,
	ListOrdered,
	Monitor,
	Moon,
	Quote,
	Sun,
	Underline,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
	title: "UI/ToggleGroup",
	component: ToggleGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default toggle group demo with text formatting
export const Default: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Text alignment toggle group
export const TextAlignment: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="justify" aria-label="Align justify">
				<AlignJustify className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// List formatting toggle group
export const ListFormatting: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bullet" aria-label="Bullet list">
				<List className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="ordered" aria-label="Ordered list">
				<ListOrdered className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="quote" aria-label="Quote">
				<Quote className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="code" aria-label="Code block">
				<Code className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Heading levels toggle group
export const HeadingLevels: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="h1" aria-label="Heading 1">
				<Heading1 className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="h2" aria-label="Heading 2">
				<Heading2 className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="h3" aria-label="Heading 3">
				<Heading3 className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Theme toggle group
export const ThemeToggle: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="light" aria-label="Light theme">
				<Sun className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="dark" aria-label="Dark theme">
				<Moon className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="system" aria-label="System theme">
				<Monitor className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Color picker toggle group
export const ColorPicker: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="red" aria-label="Red">
				<div className="h-4 w-4 rounded-full bg-red-500" />
			</ToggleGroupItem>
			<ToggleGroupItem value="blue" aria-label="Blue">
				<div className="h-4 w-4 rounded-full bg-blue-500" />
			</ToggleGroupItem>
			<ToggleGroupItem value="green" aria-label="Green">
				<div className="h-4 w-4 rounded-full bg-green-500" />
			</ToggleGroupItem>
			<ToggleGroupItem value="yellow" aria-label="Yellow">
				<div className="h-4 w-4 rounded-full bg-yellow-500" />
			</ToggleGroupItem>
			<ToggleGroupItem value="purple" aria-label="Purple">
				<div className="h-4 w-4 rounded-full bg-purple-500" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Text formatting with labels
export const WithLabels: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
				<span className="ml-2">Bold</span>
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
				<span className="ml-2">Italic</span>
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
				<span className="ml-2">Underline</span>
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Multiple selection toggle group
export const MultipleSelection: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
				<span className="h-4 w-4 text-center text-sm">S</span>
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Single selection toggle group
export const SingleSelection: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center">
				<AlignCenter className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Default variant toggle group
export const DefaultVariant: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Small size toggle group
export const SmallSize: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Large size toggle group
export const LargeSize: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-5 w-5" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-5 w-5" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-5 w-5" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Disabled toggle group
export const Disabled: Story = {
	args: { type: "multiple", variant: "outline", disabled: true },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Mixed disabled states
export const MixedDisabled: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic" disabled>
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Custom styling toggle group
export const CustomStyling: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args} className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Toggle group with text only
export const TextOnly: Story = {
	args: { type: "single", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="small" aria-label="Small text">
				Small
			</ToggleGroupItem>
			<ToggleGroupItem value="medium" aria-label="Medium text">
				Medium
			</ToggleGroupItem>
			<ToggleGroupItem value="large" aria-label="Large text">
				Large
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Toggle group with mixed content
export const MixedContent: Story = {
	args: { type: "multiple", variant: "outline" },
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
				<span className="ml-2">Bold</span>
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline">
				Underline
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

// Toggle group demo component
export function ToggleGroupDemo() {
	return (
		<ToggleGroup variant="outline" type="multiple">
			<ToggleGroupItem value="bold" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
