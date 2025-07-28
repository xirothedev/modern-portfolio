import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table";

const meta = {
	title: "UI/Table",
	component: Table,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Table>
			<TableCaption>A list of users and their roles.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Alice</TableCell>
					<TableCell>alice@example.com</TableCell>
					<TableCell>Admin</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Bob</TableCell>
					<TableCell>bob@example.com</TableCell>
					<TableCell>User</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Charlie</TableCell>
					<TableCell>charlie@example.com</TableCell>
					<TableCell>Moderator</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total: 3 users</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	),
};
