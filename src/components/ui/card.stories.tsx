import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "./card";
import { Button } from "./button";

const meta = {
	title: "UI/Card",
	component: Card,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
	render: () => (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Short description of the card.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>
					This is some content inside the card. You can place anything here like text, form fields, images,
					etc.
				</p>
			</CardContent>
			<CardFooter>
				<Button variant="default">Action</Button>
			</CardFooter>
		</Card>
	),
};

export const WithAction: Story = {
	render: () => (
		<Card>
			<CardHeader>
				<CardTitle>Card with Action</CardTitle>
				<CardDescription>This card has a top-right action button.</CardDescription>
				<CardAction>
					<Button size="sm" variant="outline">
						Edit
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>You can place action buttons in the top-right using the CardAction slot.</p>
			</CardContent>
		</Card>
	),
};
