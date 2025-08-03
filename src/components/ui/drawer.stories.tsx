import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Minus, Plus } from "lucide-react";

import { useState } from "react";

import { Button } from "./button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";

const meta = {
	title: "UI/Drawer",
	component: Drawer,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic drawer with goal setting functionality
export const Default: Story = {
	render: (args) => {
		const [goal, setGoal] = useState<number>(350);

		function onClick(adjustment: number) {
			setGoal(Math.max(200, Math.min(400, goal + adjustment)));
		}

		return (
			<Drawer {...args}>
				<DrawerTrigger asChild>
					<Button variant="outline">Open Drawer</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Move Goal</DrawerTitle>
							<DrawerDescription>Set your daily activity goal.</DrawerDescription>
						</DrawerHeader>
						<div className="p-4 pb-0">
							<div className="flex items-center justify-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 rounded-full"
									onClick={() => onClick(-10)}
									disabled={goal <= 200}
								>
									<Minus />
									<span className="sr-only">Decrease</span>
								</Button>
								<div className="flex-1 text-center">
									<div className="text-7xl font-bold tracking-tighter">{goal}</div>
									<div className="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
								</div>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 rounded-full"
									onClick={() => onClick(10)}
									disabled={goal >= 400}
								>
									<Plus />
									<span className="sr-only">Increase</span>
								</Button>
							</div>
						</div>
						<DrawerFooter>
							<Button>Submit</Button>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>
		);
	},
};

// Simple drawer with basic content
export const Simple: Story = {
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button variant="outline">Open Simple Drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Simple Drawer</DrawerTitle>
						<DrawerDescription>This is a simple drawer with basic content.</DrawerDescription>
					</DrawerHeader>
					<div className="p-4">
						<p className="text-muted-foreground text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua.
						</p>
					</div>
					<DrawerFooter>
						<Button>Confirm</Button>
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	),
};

// Drawer with form content
export const WithForm: Story = {
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button variant="outline">Open Form Drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Create New Item</DrawerTitle>
						<DrawerDescription>Fill out the form below to create a new item.</DrawerDescription>
					</DrawerHeader>
					<div className="space-y-4 p-4">
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Name
							</label>
							<input
								id="name"
								type="text"
								placeholder="Enter name"
								className="w-full rounded-md border px-3 py-2"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium">
								Description
							</label>
							<textarea
								id="description"
								placeholder="Enter description"
								className="w-full rounded-md border px-3 py-2"
								rows={3}
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="category" className="text-sm font-medium">
								Category
							</label>
							<select id="category" className="w-full rounded-md border px-3 py-2">
								<option>Select category</option>
								<option>Category 1</option>
								<option>Category 2</option>
								<option>Category 3</option>
							</select>
						</div>
					</div>
					<DrawerFooter>
						<Button>Create Item</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	),
};

// Drawer with list content
export const WithList: Story = {
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button variant="outline">Open List Drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Settings</DrawerTitle>
						<DrawerDescription>Manage your application settings.</DrawerDescription>
					</DrawerHeader>
					<div className="p-4">
						<div className="space-y-2">
							{[
								"Account Settings",
								"Privacy & Security",
								"Notifications",
								"Appearance",
								"Language",
								"Help & Support",
							].map((item, index) => (
								<div
									key={index}
									className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border p-3"
								>
									<span className="text-sm">{item}</span>
									<Plus className="text-muted-foreground h-4 w-4" />
								</div>
							))}
						</div>
					</div>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	),
};

// Drawer with custom styling
export const CustomStyling: Story = {
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
					Open Custom Drawer
				</Button>
			</DrawerTrigger>
			<DrawerContent className="bg-gradient-to-br from-slate-50 to-slate-100">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader className="text-center">
						<DrawerTitle className="text-slate-800">Custom Styled Drawer</DrawerTitle>
						<DrawerDescription className="text-slate-600">
							This drawer has custom styling applied.
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-4">
						<div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-sm text-slate-700">
								This content area has a white background with custom styling.
							</p>
						</div>
					</div>
					<DrawerFooter>
						<Button className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
							Custom Button
						</Button>
						<DrawerClose asChild>
							<Button variant="outline" className="border-slate-300 text-slate-700">
								Cancel
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	),
};

// Drawer without footer
export const WithoutFooter: Story = {
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button variant="outline">Open Drawer Without Footer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>No Footer Drawer</DrawerTitle>
						<DrawerDescription>This drawer doesn&apos;t have a footer section.</DrawerDescription>
					</DrawerHeader>
					<div className="p-4">
						<p className="text-muted-foreground text-sm">
							You can close this drawer by clicking outside or using the escape key.
						</p>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	),
};
