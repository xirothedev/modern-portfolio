import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bell,
	BellOff,
	Bold,
	Bookmark,
	Code,
	Eye,
	EyeOff,
	Heading1,
	Heading2,
	Heading3,
	Heart,
	Italic,
	List,
	ListOrdered,
	Lock,
	Monitor,
	Moon,
	Quote,
	Star,
	Sun,
	Underline,
	Unlock,
	Volume2,
	VolumeX,
	Wifi,
	WifiOff,
} from "lucide-react";

import { Toggle } from "./toggle";

const meta = {
	title: "UI/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default toggle demo
export const Default: Story = {
	render: () => (
		<Toggle aria-label="Toggle italic">
			<Bold className="h-4 w-4" />
		</Toggle>
	),
};

// Toggle with text formatting icons
export const TextFormatting: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with text alignment icons
export const TextAlignment: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Align left">
				<AlignLeft className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Align center">
				<AlignCenter className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Align right">
				<AlignRight className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Align justify">
				<AlignJustify className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with list formatting icons
export const ListFormatting: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Bullet list">
				<List className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Ordered list">
				<ListOrdered className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Quote">
				<Quote className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Code block">
				<Code className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with heading icons
export const HeadingIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Heading 1">
				<Heading1 className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Heading 2">
				<Heading2 className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Heading 3">
				<Heading3 className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with theme icons
export const ThemeIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Light theme">
				<Sun className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Dark theme">
				<Moon className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="System theme">
				<Monitor className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with media control icons
export const MediaControls: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle sound">
				<Volume2 className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle mute">
				<VolumeX className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle visibility">
				<Eye className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle hidden">
				<EyeOff className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with network icons
export const NetworkIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle WiFi">
				<Wifi className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle WiFi off">
				<WifiOff className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle notifications">
				<Bell className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle notifications off">
				<BellOff className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with security icons
export const SecurityIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle lock">
				<Lock className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle unlock">
				<Unlock className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with favorite icons
export const FavoriteIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle favorite">
				<Heart className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle star">
				<Star className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle bookmark">
				<Bookmark className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with outline variant
export const OutlineVariant: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle variant="outline" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with different sizes
export const DifferentSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Toggle size="sm" aria-label="Small toggle">
				<Bold className="h-3 w-3" />
			</Toggle>
			<Toggle size="default" aria-label="Default toggle">
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle size="lg" aria-label="Large toggle">
				<Bold className="h-5 w-5" />
			</Toggle>
		</div>
	),
};

// Toggle with text labels
export const WithTextLabels: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
				<span>Bold</span>
			</Toggle>
			<Toggle aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
				<span>Italic</span>
			</Toggle>
			<Toggle aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
				<span>Underline</span>
			</Toggle>
		</div>
	),
};

// Toggle with outline variant and text
export const OutlineWithText: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle variant="outline" aria-label="Toggle bold">
				<Bold className="h-4 w-4" />
				<span>Bold</span>
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle italic">
				<Italic className="h-4 w-4" />
				<span>Italic</span>
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle underline">
				<Underline className="h-4 w-4" />
				<span>Underline</span>
			</Toggle>
		</div>
	),
};

// Toggle with text only
export const TextOnly: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle small text">Small</Toggle>
			<Toggle aria-label="Toggle medium text">Medium</Toggle>
			<Toggle aria-label="Toggle large text">Large</Toggle>
		</div>
	),
};

// Toggle with outline variant and text only
export const OutlineTextOnly: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle variant="outline" aria-label="Toggle small text">
				Small
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle medium text">
				Medium
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle large text">
				Large
			</Toggle>
		</div>
	),
};

// Disabled toggles
export const Disabled: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle disabled aria-label="Disabled toggle">
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle disabled variant="outline" aria-label="Disabled outline toggle">
				<Italic className="h-4 w-4" />
			</Toggle>
			<Toggle disabled aria-label="Disabled text toggle">
				Disabled
			</Toggle>
		</div>
	),
};

// Mixed disabled states
export const MixedDisabled: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Enabled toggle">
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle disabled aria-label="Disabled toggle">
				<Italic className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Enabled toggle">
				<Underline className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with custom styling
export const CustomStyling: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle
				className="bg-blue-500 text-white hover:bg-blue-600 data-[state=on]:bg-blue-700"
				aria-label="Custom blue toggle"
			>
				<Bold className="h-4 w-4" />
			</Toggle>
			<Toggle
				className="bg-green-500 text-white hover:bg-green-600 data-[state=on]:bg-green-700"
				aria-label="Custom green toggle"
			>
				<Heart className="h-4 w-4" />
			</Toggle>
			<Toggle
				className="bg-purple-500 text-white hover:bg-purple-600 data-[state=on]:bg-purple-700"
				aria-label="Custom purple toggle"
			>
				<Star className="h-4 w-4" />
			</Toggle>
		</div>
	),
};

// Toggle with color indicators
export const ColorIndicators: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Red color">
				<div className="h-4 w-4 rounded-full bg-red-500" />
			</Toggle>
			<Toggle aria-label="Blue color">
				<div className="h-4 w-4 rounded-full bg-blue-500" />
			</Toggle>
			<Toggle aria-label="Green color">
				<div className="h-4 w-4 rounded-full bg-green-500" />
			</Toggle>
			<Toggle aria-label="Yellow color">
				<div className="h-4 w-4 rounded-full bg-yellow-500" />
			</Toggle>
		</div>
	),
};

// Toggle with mixed content
export const MixedContent: Story = {
	render: () => (
		<div className="flex gap-2">
			<Toggle aria-label="Toggle with icon and text">
				<Bold className="h-4 w-4" />
				<span>Bold</span>
			</Toggle>
			<Toggle aria-label="Toggle with icon only">
				<Italic className="h-4 w-4" />
			</Toggle>
			<Toggle aria-label="Toggle with text only">Underline</Toggle>
			<Toggle aria-label="Toggle with color">
				<div className="h-4 w-4 rounded-full bg-red-500" />
			</Toggle>
		</div>
	),
};

// Toggle demo component
export function ToggleDemo() {
	return (
		<Toggle aria-label="Toggle italic">
			<Bold className="h-4 w-4" />
		</Toggle>
	);
}
