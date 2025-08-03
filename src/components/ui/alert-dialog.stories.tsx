import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

const meta = {
	title: "UI/AlertDialog",
	component: AlertDialog,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		defaultOpen: false,
	},
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic AlertDialog with trigger
export const Default: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Open Alert Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data
						from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

// AlertDialog with destructive action
export const Destructive: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Delete Account</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Account</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data
						from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Delete Account
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

// AlertDialog with custom content
export const CustomContent: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button>Show Custom Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Custom Alert Dialog</AlertDialogTitle>
					<AlertDialogDescription>
						This is a custom alert dialog with different styling and content. You can customize the
						appearance and behavior as needed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>No, thanks</AlertDialogCancel>
					<AlertDialogAction>Yes, proceed</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

// AlertDialog with long content
export const LongContent: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Show Long Content</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
					<AlertDialogDescription className="max-h-60 overflow-y-auto">
						<p className="mb-4">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
							laboris nisi ut aliquip ex ea commodo consequat.
						</p>
						<p className="mb-4">
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
							pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
						<p className="mb-4">
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
							laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
							architecto beatae vitae dicta sunt explicabo.
						</p>
						<p>
							Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
							consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Decline</AlertDialogCancel>
					<AlertDialogAction>Accept</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

// Interactive AlertDialog with state management
export const Interactive: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState<boolean>(false);
		const [action, setAction] = useState<string | null>(null);

		return (
			<div className="space-y-4">
				<div className="flex gap-2">
					<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
						<AlertDialogTrigger asChild>
							<Button onClick={() => setIsOpen(true)}>Open Interactive Dialog</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Interactive Alert Dialog</AlertDialogTitle>
								<AlertDialogDescription>
									This dialog tracks your actions and shows the result below.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel onClick={() => setAction("cancelled")}>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => setAction("confirmed")}>Confirm</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				{action && (
					<div className="rounded-lg border p-4">
						<p className="text-sm font-medium">Last Action:</p>
						<p className="text-muted-foreground text-sm">
							{action === "cancelled" ? "Dialog was cancelled" : "Dialog was confirmed"}
						</p>
					</div>
				)}
			</div>
		);
	},
};

// AlertDialog with different button variants
export const ButtonVariants: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button variant="secondary">Show Button Variants</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Button Variants Example</AlertDialogTitle>
					<AlertDialogDescription>
						This dialog demonstrates different button styling options.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Default Action</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

// AlertDialog with custom styling
export const CustomStyling: Story = {
	render: (args) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
					Custom Styled Dialog
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-slate-800">Custom Styled Alert Dialog</AlertDialogTitle>
					<AlertDialogDescription className="text-slate-600">
						This dialog has custom styling applied to demonstrate the flexibility of the component.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-200">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};
