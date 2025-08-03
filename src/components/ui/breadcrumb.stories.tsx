import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./breadcrumb";

const meta = {
	title: "UI/Breadcrumb",
	component: Breadcrumb,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
					<BreadcrumbSeparator />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Docs</BreadcrumbLink>
					<BreadcrumbSeparator />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithEllipsis: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
					<BreadcrumbSeparator />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbEllipsis />
					<BreadcrumbSeparator />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">UI</BreadcrumbLink>
					<BreadcrumbSeparator />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
