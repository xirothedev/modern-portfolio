import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta = {
	title: "UI/HoverCard",
	component: HoverCard,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic hover card with user profile
export const Default: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="link">@nextjs</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>VC</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">@nextjs</h4>
						<p className="text-sm">The React Framework – created and maintained by @vercel.</p>
						<div className="flex items-center pt-2">
							<CalendarDays className="mr-2 h-4 w-4 opacity-70" />
							<span className="text-muted-foreground text-xs">Joined December 2021</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with product information
export const ProductCard: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="outline">View Product Details</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="space-y-3">
					<div className="flex items-center space-x-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
							P
						</div>
						<div>
							<h4 className="text-sm font-semibold">Premium Widget</h4>
							<p className="text-muted-foreground text-xs">Product ID: #12345</p>
						</div>
					</div>
					<p className="text-muted-foreground text-sm">
						High-quality widget with advanced features and premium materials. Perfect for professional use
						cases.
					</p>
					<div className="flex items-center justify-between">
						<span className="text-lg font-bold text-green-600">$299.99</span>
						<span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">In Stock</span>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with statistics
export const StatsCard: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="ghost">Analytics Overview</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="space-y-3">
					<h4 className="text-sm font-semibold">Website Analytics</h4>
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">12.5K</div>
							<div className="text-muted-foreground text-xs">Visitors</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">89%</div>
							<div className="text-muted-foreground text-xs">Conversion</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">2.3K</div>
							<div className="text-muted-foreground text-xs">Sales</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">$45K</div>
							<div className="text-muted-foreground text-xs">Revenue</div>
						</div>
					</div>
					<div className="text-muted-foreground text-xs">Last 30 days performance</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with action buttons
export const WithActions: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="outline">Quick Actions</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="space-y-3">
					<h4 className="text-sm font-semibold">Quick Actions</h4>
					<p className="text-muted-foreground text-sm">
						Perform common tasks quickly without navigating away.
					</p>
					<div className="flex flex-wrap gap-2">
						<Button size="sm" variant="outline">
							Edit
						</Button>
						<Button size="sm" variant="outline">
							Share
						</Button>
						<Button size="sm" variant="outline">
							Export
						</Button>
						<Button size="sm" variant="destructive">
							Delete
						</Button>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with image
export const WithImage: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="link">View Image Details</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="space-y-3">
					<div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-yellow-500 font-bold text-white">
						Image Preview
					</div>
					<div>
						<h4 className="text-sm font-semibold">Beautiful Landscape</h4>
						<p className="text-muted-foreground text-xs">Captured on March 15, 2024 • 1920x1080 • 2.3MB</p>
					</div>
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">Tags: nature, landscape, sunset</span>
						<span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">Featured</span>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with different alignments
export const Alignments: Story = {
	render: (args) => (
		<div className="flex items-center justify-center gap-4">
			<HoverCard {...args}>
				<HoverCardTrigger asChild>
					<Button variant="outline" size="sm">
						Top
					</Button>
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-64">
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Top Alignment</h4>
						<p className="text-muted-foreground text-xs">This hover card appears above the trigger.</p>
					</div>
				</HoverCardContent>
			</HoverCard>

			<HoverCard {...args}>
				<HoverCardTrigger asChild>
					<Button variant="outline" size="sm">
						Bottom
					</Button>
				</HoverCardTrigger>
				<HoverCardContent side="bottom" className="w-64">
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Bottom Alignment</h4>
						<p className="text-muted-foreground text-xs">This hover card appears below the trigger.</p>
					</div>
				</HoverCardContent>
			</HoverCard>

			<HoverCard {...args}>
				<HoverCardTrigger asChild>
					<Button variant="outline" size="sm">
						Left
					</Button>
				</HoverCardTrigger>
				<HoverCardContent side="left" className="w-64">
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Left Alignment</h4>
						<p className="text-muted-foreground text-xs">
							This hover card appears to the left of the trigger.
						</p>
					</div>
				</HoverCardContent>
			</HoverCard>

			<HoverCard {...args}>
				<HoverCardTrigger asChild>
					<Button variant="outline" size="sm">
						Right
					</Button>
				</HoverCardTrigger>
				<HoverCardContent side="right" className="w-64">
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Right Alignment</h4>
						<p className="text-muted-foreground text-xs">
							This hover card appears to the right of the trigger.
						</p>
					</div>
				</HoverCardContent>
			</HoverCard>
		</div>
	),
};

// Hover card with custom styling
export const CustomStyling: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
					Custom Styled
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
				<div className="space-y-3">
					<div className="flex items-center space-x-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white">
							C
						</div>
						<div>
							<h4 className="text-sm font-semibold text-slate-800">Custom Design</h4>
							<p className="text-xs text-slate-600">Premium styling</p>
						</div>
					</div>
					<p className="text-sm text-slate-700">
						This hover card features custom gradients and styling to match your design system.
					</p>
					<div className="flex gap-2">
						<Button size="sm" className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
							Action
						</Button>
						<Button size="sm" variant="outline" className="border-slate-300 text-slate-700">
							Cancel
						</Button>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

// Hover card with long content
export const LongContent: Story = {
	render: (args) => (
		<HoverCard {...args}>
			<HoverCardTrigger asChild>
				<Button variant="outline">Read More</Button>
			</HoverCardTrigger>
			<HoverCardContent className="max-h-64 w-96 overflow-y-auto">
				<div className="space-y-3">
					<h4 className="text-sm font-semibold">Article Preview</h4>
					<div className="text-muted-foreground space-y-2 text-sm">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
							laboris nisi ut aliquip ex ea commodo consequat.
						</p>
						<p>
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
							pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
						<p>
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
							laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
							architecto beatae vitae dicta sunt explicabo.
						</p>
					</div>
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">5 min read</span>
						<Button size="sm" variant="outline">
							Continue Reading
						</Button>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};
