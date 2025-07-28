import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { AlertCircle } from "lucide-react";

const meta = {
	title: "UI/Alert",
	component: Alert,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		variant: "default",
	},
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
	render: (args) => (
		<Alert {...args}>
			<AlertTitle>Heads up!</AlertTitle>
			<AlertDescription>This is a default alert message.</AlertDescription>
		</Alert>
	),
	args: {
		variant: "default",
	},
};

export const Destructive: Story = {
	render: (args) => (
		<Alert {...args}>
			<AlertCircle className="mt-0.5" />
			<div>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Something went terribly wrong.</AlertDescription>
			</div>
		</Alert>
	),
	args: {
		variant: "destructive",
	},
};

export const WithTitle: Story = {
	render: (args) => (
		<Alert {...args}>
			<AlertTitle>Notice</AlertTitle>
		</Alert>
	),
	args: {
		variant: "default",
	},
};

export const WithDescription: Story = {
	render: (args) => (
		<Alert {...args}>
			<AlertDescription>This alert only has a description. No title is provided.</AlertDescription>
		</Alert>
	),
	args: {
		variant: "default",
	},
};
