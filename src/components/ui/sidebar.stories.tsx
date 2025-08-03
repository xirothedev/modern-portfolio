import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "./sidebar";

const meta = {
	title: "UI/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<SidebarProvider>
			<div className="flex h-[400px] w-full">
				<Sidebar>
					<SidebarHeader>Sidebar Header</SidebarHeader>
					<SidebarContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton>Projects</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton>Settings</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter>Sidebar Footer</SidebarFooter>
				</Sidebar>
				<div className="flex flex-1 flex-col items-center justify-center">
					<SidebarTrigger className="mb-4" />
					<Button>Some Main Action</Button>
				</div>
			</div>
		</SidebarProvider>
	),
};
