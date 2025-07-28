import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./sheet";

const meta = {
	title: "UI/Sheet",
	component: Sheet,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Open Sheet</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Sheet Title</SheetTitle>
					<SheetDescription>This is a description for the sheet.</SheetDescription>
				</SheetHeader>
				<div className="p-4">Sheet main content goes here.</div>
				<SheetFooter>
					<Button variant="outline" asChild>
						<SheetClose>Cancel</SheetClose>
					</Button>
					<Button>Save</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

export const LeftSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Open Left Sheet</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Left Sheet</SheetTitle>
				</SheetHeader>
				<div className="p-4">Content from the left.</div>
			</SheetContent>
		</Sheet>
	),
};

export const TopSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Open Top Sheet</Button>
			</SheetTrigger>
			<SheetContent side="top">
				<SheetHeader>
					<SheetTitle>Top Sheet</SheetTitle>
				</SheetHeader>
				<div className="p-4">Content from the top.</div>
			</SheetContent>
		</Sheet>
	),
};

export const BottomSide: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Open Bottom Sheet</Button>
			</SheetTrigger>
			<SheetContent side="bottom">
				<SheetHeader>
					<SheetTitle>Bottom Sheet</SheetTitle>
				</SheetHeader>
				<div className="p-4">Content from the bottom.</div>
			</SheetContent>
		</Sheet>
	),
};
