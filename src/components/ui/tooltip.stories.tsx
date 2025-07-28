import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
	title: "UI/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button>Hover me</Button>
				</TooltipTrigger>
				<TooltipContent>Tooltip content</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};

export const Placement: Story = {
	render: () => (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button>Top</Button>
					</TooltipTrigger>
					<TooltipContent side="top">Tooltip on top</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button>Right</Button>
					</TooltipTrigger>
					<TooltipContent side="right">Tooltip on right</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button>Bottom</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button>Left</Button>
					</TooltipTrigger>
					<TooltipContent side="left">Tooltip on left</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	),
};

export const CustomContent: Story = {
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button>Info</Button>
				</TooltipTrigger>
				<TooltipContent>
					<div className="flex flex-col items-center">
						<span className="font-bold">Custom Tooltip</span>
						<span className="text-muted-foreground text-xs">With more details here.</span>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};
